import { CACHE_TTL_MS, PAGE_LIMIT, SORT } from "../config/kitsu.js";
import { kitsuFetch } from "../api/kitsuClient.js";
import { normalizeMedia } from "../api/normalize.js";
import { rememberItem } from "../utils.js";

const cache = new Map();

function cacheKey(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`;
}

function readCache(key) {
  const hit = cache.get(key);
  if (!hit) return null;

  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }

  return hit.value;
}

function writeCache(key, value) {
  cache.set(key, { at: Date.now(), value });
  return value;
}

export async function searchMedia({
  kind = "anime",
  query = "",
  sort = SORT.popular,
  limit = PAGE_LIMIT,
  offset = 0,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || PAGE_LIMIT, 1), PAGE_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const params = {
    "page[limit]": safeLimit,
    "page[offset]": safeOffset,
    sort,
    include: "categories",
  };

  if (query) params["filter[text]"] = query;

  const key = cacheKey("search", {
    kind,
    query,
    sort,
    limit: safeLimit,
    offset: safeOffset,
  });

  const hit = readCache(key);
  if (hit) return hit;

  const payload = await kitsuFetch(`/${kind}`, { params, signal });
  const rows = Array.isArray(payload.data)
    ? payload.data
    : payload.data
      ? [payload.data]
      : [];

  const items = rows
    .map((raw) => normalizeMedia(raw, { kind, included: payload.included || [] }))
    .filter((item) => !item.nsfw);

  items.forEach(rememberItem);

  const result = {
    items,
    nextOffset: rows.length === safeLimit ? safeOffset + safeLimit : null,
  };

  return writeCache(key, result);
}

export async function fetchCatalog({
  kind = "all",
  query = "",
  sort = SORT.popular,
  limit = PAGE_LIMIT,
  offset = 0,
  signal,
} = {}) {
  const safeLimit = Math.min(Math.max(Number(limit) || PAGE_LIMIT, 1), PAGE_LIMIT);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  if (kind === "anime" || kind === "manga") {
    return searchMedia({ kind, query, sort, limit: safeLimit, offset: safeOffset, signal });
  }

  const [anime, manga] = await Promise.all([
    searchMedia({ kind: "anime", query, sort, limit: safeLimit, offset: safeOffset, signal }),
    searchMedia({ kind: "manga", query, sort, limit: safeLimit, offset: safeOffset, signal }),
  ]);

  const hasMore = anime.nextOffset !== null || manga.nextOffset !== null;

  return {
    items: [...anime.items, ...manga.items],
    nextOffset: hasMore ? safeOffset + safeLimit : null,
  };
}