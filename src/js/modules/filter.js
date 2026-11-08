/**
 * Domain murni: menyaring array item media.
 * Tidak boleh menyentuh DOM dan tidak boleh melakukan fetch.
 */

import { ALL_AURA_ID, matchAura } from "../utils/auraMapper.js"

/**
 * Membangun satu string besar berisi semua teks yang bisa dicari
 * dari sebuah item: judul, genre, studio, tahun, dan seterusnya.
 */
function buildHaystack(item) {
  return [
    item.title,
    item.titleEnglish,
    item.titleJapanese,
    item.type,
    item.status,
    item.studio,
    item.year,
    item.kind,
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

/**
 * Menyingkirkan item berdasarkan kata kunci DAN aura.
 *
 * Aura "all" selalu lolos, jadi memilih "Semua Vibes" tidak mengubah
 * hasil pencarian sama sekali.
 */
export function filterMedia(items, { query = "", auraId = ALL_AURA_ID } = {}) {
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean)

  return items.filter((item) => {
    if (!matchAura(item, auraId)) return false
    if (terms.length === 0) return true

    const haystack = buildHaystack(item)

    return terms.every((term) => haystack.includes(term))
  })
}
        
