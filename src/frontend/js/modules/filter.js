import { ALL_AURA_ID, matchAura } from "./auraMapper.js";

/**
 * Membangun satu string besar berisi semua teks yang bisa dicari
 * dari sebuah item: judul, kategori, jenis, tahun, dan seterusnya.
 */
function buildHaystack(item) {
  return [
    item.title,
    item.titleJa,
    item.kindLabel,
    item.subtypeLabel,
    item.status,
    item.year,
    ...(item.categories || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Mengumpulkan kategori dari item yang sudah dimuat, diurutkan dari yang
 * paling sering muncul. Dipakai untuk chip kategori dinamis.
 */
export function collectCategories(items) {
  const counts = new Map();

  items.forEach((item) => {
    (item.categories || []).forEach((name) => {
      counts.set(name, (counts.get(name) || 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

/**
 * Menyaring item berdasarkan kata kunci, aura, kategori, dan jenis.
 *
 * Aura "all" selalu lolos, jadi memilih "Semua Vibes" tidak mengubah
 * hasil pencarian sama sekali.
 */
export function filterMedia(
  items,
  { query = "", auraId = ALL_AURA_ID, category = "all", kind = "all" } = {}
) {
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);

  return items.filter((item) => {
    if (kind !== "all" && item.kind !== kind) return false;

    if (category !== "all" && !(item.categories || []).includes(category)) {
      return false;
    }

    if (!matchAura(item, auraId)) return false;
    if (terms.length === 0) return true;

    const haystack = buildHaystack(item);

    return terms.every((term) => haystack.includes(term));
  });
}