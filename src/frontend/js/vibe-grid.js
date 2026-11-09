import * as nav from "./ui/nav.js";
import * as parallax from "./ui/parallax.js";
import * as bookModal from "./ui/bookModal.js";
import * as media from "./services/mediaService.js";
import * as renderer from "./modules/renderer.js";
import * as filters from "./modules/filter.js";
import { ALL_AURA_ID, AURAS, getAuraLabel } from "./modules/auraMapper.js";
import { SORT } from "./config/kitsu.js";
import { debounce } from "./utils.js";

const initNav = nav.initNav || (() => {});
const initParallax = parallax.initParallax || (() => {});
const initBookModal = bookModal.initBookModal || (() => {});
const fetchCatalog = media.fetchCatalog;
const renderBooks = renderer.renderBooks;
const renderSkeletons = renderer.renderSkeletons;
const renderNotice = renderer.renderNotice;
const collectCategories = filters.collectCategories;
const filterMedia = filters.filterMedia;

const state = {
  items: [],
  query: "",
  auraId: ALL_AURA_ID,
  category: "all",
  kind: "all",
  sort: "popular",
  offset: 0,
  nextOffset: null,
  loading: false,
  requestId: 0,
};

const els = {
  search: document.querySelector("[data-library-search]"),
  kindWrap: document.querySelector("[data-kind-chips]"),
  auraWrap: document.querySelector("[data-aura-chips]"),
  categoryWrap: document.querySelector("[data-category-chips]"),
  sort: document.querySelector("[data-sort]"),
  grid: document.querySelector("[data-library-grid]"),
  status: document.querySelector("[data-library-status]"),
  count: document.querySelector("[data-result-count]"),
  loadMore: document.querySelector("[data-load-more]"),
};

let lastCategories = "";

function setStatus(message) {
  if (els.status) els.status.textContent = message || "";
}

function dedupe(items) {
  const seen = new Set();

  return items.filter((item) => {
    const id = item?.id ?? item?.slug ?? item?.title;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function activeAuraButtons() {
  if (!els.auraWrap) return;

  els.auraWrap.querySelectorAll("[data-aura]").forEach((button) => {
    const active = button.dataset.aura === state.auraId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderAuraChips() {
  if (!els.auraWrap) return;

  els.auraWrap.replaceChildren();

  const options = [{ id: ALL_AURA_ID, label: "Semua Vibes", hint: "" }, ...AURAS];

  options.forEach(({ id, label, hint }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.aura = id;
    button.textContent = label;
    if (hint) button.title = hint;
    els.auraWrap.append(button);
  });

  activeAuraButtons();
}

function activeCategoryButtons() {
  if (!els.categoryWrap) return;

  els.categoryWrap.querySelectorAll("[data-category]").forEach((button) => {
    const active = button.dataset.category === state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCategoryChips(categories) {
  if (!els.categoryWrap) return;

  const visible = categories.slice(0, 12);
  const signature = visible.join("|");

  if (signature === lastCategories && els.categoryWrap.children.length) {
    activeCategoryButtons();
    return;
  }

  lastCategories = signature;
  const current = state.category;
  els.categoryWrap.replaceChildren();

  const all = document.createElement("button");
  all.type = "button";
  all.className = "chip";
  all.dataset.category = "all";
  all.textContent = "Semua";
  els.categoryWrap.append(all);

  visible.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.category = category;
    button.textContent = category;
    els.categoryWrap.append(button);
  });

  const stillThere = [...els.categoryWrap.querySelectorAll("[data-category]")].some(
    (button) => button.dataset.category === current
  );

  if (!stillThere) state.category = "all";
  activeCategoryButtons();
}

function emptyMessage() {
  if (state.query) return `Tidak ada hasil untuk “${state.query}”.`;
  if (state.auraId !== ALL_AURA_ID) return `Tidak ada judul untuk vibe ${getAuraLabel(state.auraId)}.`;
  if (state.category !== "all") return "Tidak ada judul di kategori ini.";
  return "Belum ada judul di katalog ini.";
}

function renderResults() {
  if (!els.grid) return;

  const categories = collectCategories(state.items) || [];
  renderCategoryChips(categories);

  const filtered =
    filterMedia(state.items, {
      query: state.query,
      auraId: state.auraId,
      category: state.category,
      kind: state.kind,
    }) || [];

  if (els.count) els.count.textContent = `${filtered.length} judul`;

  if (!filtered.length) {
    renderNotice?.(els.grid, emptyMessage());
    setStatus("");
    return;
  }

  renderBooks(els.grid, filtered);
  setStatus("");
}

async function load({ append = false } = {}) {
  if (!els.grid || !fetchCatalog) return;

  const requestId = ++state.requestId;
  state.loading = true;

  if (!append) {
    state.offset = 0;
    state.nextOffset = null;
    renderSkeletons?.(els.grid, 8);
  }

  setStatus(append ? "Menambah judul…" : "Membuka katalog…");
  if (els.loadMore) els.loadMore.disabled = true;

  try {
    const result = await fetchCatalog({
      kind: state.kind,
      query: state.query,
      sort: SORT[state.sort] || SORT.popular,
      limit: 20,
      offset: state.offset,
    });

    if (requestId !== state.requestId) return;

    const items = Array.isArray(result) ? result : result?.items || [];
    const nextOffset = Array.isArray(result) ? null : result?.nextOffset ?? null;

    state.items = dedupe(append ? [...state.items, ...items] : items);
    state.nextOffset = nextOffset;
    renderResults();
  } catch (error) {
    if (requestId !== state.requestId) return;

    state.nextOffset = null;

    if (append) {
      setStatus("Gagal menambah judul. Coba lagi.");
    } else {
      renderNotice?.(els.grid, "Gagal memuat katalog dari Kitsu.", {
        retry: () => load(),
      });
      setStatus("Koneksi bermasalah. Coba lagi.");
    }

    console.warn("Katalog gagal dimuat:", error);
  } finally {
    if (requestId === state.requestId) {
      state.loading = false;

      if (els.loadMore) {
        els.loadMore.disabled = false;
        els.loadMore.hidden = state.nextOffset === null;
      }
    }
  }
}

function bindEvents() {
  const runSearch = debounce(() => {
    state.query = els.search.value.trim();
    load();
  }, 350);

  els.search?.addEventListener("input", runSearch);

  els.kindWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-kind]");
    if (!button) return;

    state.kind = button.dataset.kind;
    state.category = "all";
    lastCategories = "";

    els.kindWrap.querySelectorAll("[data-kind]").forEach((el) => {
      const active = el === button;
      el.classList.toggle("is-active", active);
      el.setAttribute("aria-pressed", String(active));
    });

    load();
  });

  els.auraWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-aura]");
    if (!button) return;

    state.auraId = button.dataset.aura;
    activeAuraButtons();
    renderResults();
  });

  els.categoryWrap?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    state.category = button.dataset.category;
    activeCategoryButtons();
    renderResults();
  });

  els.sort?.addEventListener("change", () => {
    state.sort = els.sort.value;
    load();
  });

  els.loadMore?.addEventListener("click", () => {
    if (state.loading || state.nextOffset === null) return;
    state.offset = state.nextOffset;
    load({ append: true });
  });
}

function boot() {
  initNav();
  initParallax();
  initBookModal();

  const activeKind = els.kindWrap?.querySelector("[data-kind].is-active")?.dataset.kind;
  if (activeKind) state.kind = activeKind;
  if (els.sort?.value) state.sort = els.sort.value;
  if (els.search?.value) state.query = els.search.value.trim();

  renderAuraChips();
  bindEvents();
  load();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}