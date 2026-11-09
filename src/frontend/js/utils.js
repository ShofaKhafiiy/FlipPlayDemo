const registry = new Map();

export function escapeHtml(value) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value ?? "").replace(/[&<>"']/g, (ch) => map[ch]);
}

export function rememberItem(item) {
  if (item?.id != null) registry.set(String(item.id), item);
  return item;
}

export function getItem(id) {
  return registry.get(String(id)) || null;
}

export function formatRating(rating) {
  return Number.isFinite(rating) ? rating.toFixed(1) : "—";
}

const BOOK_TONES = ["#5a2f22", "#3f4a3a", "#3a3f5a", "#5a4a2a", "#4a2f3f", "#2f4a4a"];

function hash(text) {
  let value = 0;
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 31 + text.charCodeAt(i)) >>> 0;
  }
  return value;
}

export function bookStyle(item) {
  const index = hash(String(item?.id ?? item?.title ?? "buku"));
  const tone = BOOK_TONES[index % BOOK_TONES.length];
  const height = 210 + (index % 5) * 14;
  return `--book-tone:${tone};--book-height:${height}px`;
}

export function debounce(fn, wait = 300) {
  let timer = 0;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}