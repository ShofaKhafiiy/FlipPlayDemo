const KIND_LABEL = {
  anime: "Anime",
  manga: "Manga",
};

const SUBTYPE_LABELS = {
  tv: "TV",
  movie: "Movie",
  ona: "ONA",
  ova: "OVA",
  special: "Special",
  music: "Music",
  manga: "Manga",
  novel: "Novel",
  "one-shot": "One-shot",
  doujin: "Doujin",
  manhua: "Manhua",
  manhwa: "Manhwa",
};

export function normalizeMedia(raw, { kind = "anime", included = [] } = {}) {
  const attrs = raw?.attributes || {};
  const titles = attrs.titles || {};

  const title =
    attrs.canonicalTitle ||
    titles.en ||
    titles.en_jp ||
    titles.ja_jp ||
    "Tanpa judul";

  const poster =
    attrs.posterImage?.medium ||
    attrs.posterImage?.small ||
    attrs.posterImage?.original ||
    "";

  const cover =
    attrs.coverImage?.large ||
    attrs.coverImage?.original ||
    poster;

  const ratingRaw = Number(attrs.averageRating);
  const rating = Number.isFinite(ratingRaw) ? ratingRaw / 10 : null;
  const startDate = attrs.startDate || "";
  const subtype = attrs.subtype || "";

  return {
    id: `${kind}-${raw.id}`,
    slug: attrs.slug || String(raw.id),
    kind,
    kindLabel: KIND_LABEL[kind] || "Judul",
    subtype,
    subtypeLabel: SUBTYPE_LABELS[String(subtype).toLowerCase()] || subtype,
    title,
    titleJa: titles.ja_jp || "",
    synopsis: attrs.synopsis || attrs.description || "Belum ada sinopsis.",
    poster,
    cover,
    rating,
    year: startDate.slice(0, 4),
    startDate,
    status: attrs.status || "",
    episodes: attrs.episodeCount || null,
    chapters: attrs.chapterCount || null,
    categories: categoryNames(raw, included),
    nsfw: Boolean(attrs.nsfw),
    ageRating: attrs.ageRating || "",
    url: `https://kitsu.io/${kind}/${attrs.slug || raw.id}`,
  };
}

function categoryNames(raw, included) {
  const refs = raw?.relationships?.categories?.data || [];
  const byId = new Map(
    included
      .filter((entry) => entry.type === "categories")
      .map((entry) => [entry.id, entry.attributes?.title])
  );

  return refs.map((ref) => byId.get(ref.id)).filter(Boolean);
}