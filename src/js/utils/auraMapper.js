/**
 * Domain murni: definisi Aura dan cara mencocokkan satu item ke satu aura.
 * Tidak boleh menyentuh DOM dan tidak boleh melakukan fetch.
 */

export const ALL_AURA_ID = "all"

const matchesAnyTag = (item, tags) => {
  const wanted = tags.map((tag) => tag.toLowerCase())
  return item.tags.some((tag) => wanted.includes(String(tag).toLowerCase()))
}

export const AURAS = [
  {
    id: "high-energy",
    label: "High Energy",
    hint: "Aksi, petualang, olahraga, dan cerita yang panjang.",
    match(item) {
      const energetic = [
        "Action",
        "Adventure",
        "Sports",
        "Combat Sports",
        "Mecha",
        "Super Power",
        "Shounen",
        "Sci-Fi",
        "Military",
        "Martial Arts",
      ]

      const hasTag = matchesAnyTag(item, energetic)
      const longRun = item.kind === "anime" && item.episodes >= 24

      return hasTag || longRun
    },
  },
  {
    id: "melancholy",
    label: "Melancholy",
    hint: "Drama, psikologis, dan cerita yang menghangurkan.",
    match(item) {
      const moody = [
        "Drama",
        "Psychological",
        "Thriller",
        "Romance",
        "Slice of Life",
        "Seinen",
        "Historical",
        "Tragedy",
        "Suspense",
      ]

      return matchesAnyTag(item, moody)
    },
  },
  {
    id: "binge",
    label: "Binge Mode",
    hint: "Pendek, atau bisa dituntaskan dalam satu malam.",
    match(item) {
      if (item.kind === "manga") {
        return item.chapters !== null && item.chapters <= 30
      }

      const shortType = ["movie", "ona", "special", "ova"].includes(
        String(item.type).toLowerCase()
      )
      const shortRun = item.episodes !== null && item.episodes <= 13

      return shortType || shortRun
    },
  },
  {
    id: "chill",
    label: "Chill Vibes",
    hint: "Ringan, santai, dan aman menonton kapan saja.",
    match(item) {
      const relaxed = [
        "Comedy",
        "Slice of Life",
        "Gourmet",
        "Iyashikei",
        "Parody",
        "School",
        "Harem",
        "Kids",
      ]

      return matchesAnyTag(item, relaxed)
    },
  },
]

/**
 * Mencocokkan satu item dengan aura yang dipilih.
 * Aura "all" selalu cocok.
 */
export function matchAura(item, auraId) {
  if (!auraId || auraId === ALL_AURA_ID) return true

  const aura = AURAS.find((entry) => entry.id === auraId)
  if (!aura) return true

  return aura.match(item)
}

/**
 * Mengambil label aura untuk ditampilkan.
 */
export function getAuraLabel(auraId) {
  if (auraId === ALL_AURA_ID) return "Semua Vibes"

  return AURAS.find((entry) => entry.id === auraId)?.label ?? "Semua Vibes"
}
        
