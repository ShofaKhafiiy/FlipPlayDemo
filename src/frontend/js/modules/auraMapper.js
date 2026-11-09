export const ALL_AURA_ID = "all";

function matchesAnyCategory(item, categories) {
  const wanted = categories.map((category) => category.toLowerCase());
  const owned = (item.categories || []).map((category) =>
    String(category).toLowerCase()
  );

  return owned.some((category) => wanted.includes(category));
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
        "Science Fiction",
        "Military",
        "Martial Arts",
      ];

      const hasCategory = matchesAnyCategory(item, energetic);
      const longRun = item.kind === "anime" && Number(item.episodes) >= 24;

      return hasCategory || longRun;
    },
  },
  {
    id: "melancholy",
    label: "Melancholy",
    hint: "Drama, psikologis, dan cerita yang menghangatkan.",
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
      ];

      return matchesAnyCategory(item, moody);
    },
  },
  {
    id: "binge",
    label: "Binge Mode",
    hint: "Pendek, atau bisa dituntaskan dalam satu malam.",
    match(item) {
      if (item.kind === "manga") {
        return Number(item.chapters) > 0 && Number(item.chapters) <= 30;
      }

      const shortType = ["movie", "ona", "special", "ova"].includes(
        String(item.subtype).toLowerCase()
      );
      const shortRun = Number(item.episodes) > 0 && Number(item.episodes) <= 13;

      return shortType || shortRun;
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
        "School Life",
        "Harem",
        "Kids",
      ];

      return matchesAnyCategory(item, relaxed);
    },
  },
];

/**
 * Mencocokkan satu item dengan aura yang dipilih.
 * Aura "all" selalu cocok.
 */
export function matchAura(item, auraId) {
  if (!auraId || auraId === ALL_AURA_ID) return true;

  const aura = AURAS.find((entry) => entry.id === auraId);
  if (!aura) return true;

  return aura.match(item);
}

/**
 * Mengambil label aura untuk ditampilkan.
 */
export function getAuraLabel(auraId) {
  if (auraId === ALL_AURA_ID) return "Semua Vibes";

  return AURAS.find((entry) => entry.id === auraId)?.label ?? "Semua Vibes";
}