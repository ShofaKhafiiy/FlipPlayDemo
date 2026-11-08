/**
 * Lapisan I/O.
 *
 * Aturan: HANYA file ini yang boleh memanggil fetch().
 * Keluarannya sudah dinormalisasi supaya modul lain
 * tidak perlu tahu bentuk mentah dari API.
 */

import { API_BASE, MEDIA_PAGE_SIZE, REQUEST_TIMEOUT_MS } from "../config/api.js"

/**
 * Satu query GraphQL yang dipakai untuk anime maupun manga.
 * Hasilnya sudah berisi semua kolom yang dibutuhkan kartu.
 */
const MEDIA_QUERY = `
  query MediaPage($type: MediaType, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: $type, sort: POPULARITY_DESC) {
        id
        idMal
        title { english romaji native }
        format
        status
        seasonYear
        startDate { year }
        description(asHtml: false)
        episodes
        chapters
        volumes
        averageScore
        genres
        tags { name }
        studios(isMain: true) { nodes { name } }
        coverImage { large }
        siteUrl
      }
    }
  }
`

/**
 * Label pendek untuk format AniList. Nilai mentahnya berupa
 * TV_SHORT, ONE_SHOT, dan seterusnya — terlalu “kode” untuk kartu.
 */
const FORMAT_LABELS = {
  TV: "TV",
  TV_SHORT: "Short",
  MOVIE: "Movie",
  SPECIAL: "Special",
  OVA: "OVA",
  ONA: "ONA",
  MUSIC: "Music",
  MANGA: "Manga",
  NOVEL: "Novel",
  ONE_SHOT: "One-shot",
}

/**
 * Membuang tag HTML dari deskripsi. AniList kadang mengirim <br> atau <i>
 * walau asHtml sudah false, dan deskripsi ini tetap harus berupa teks polos.
 */
function stripHtml(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim()
}

/**
 * Satu permintaan GraphQL ke AniList, dengan timeout dan pesan error yang berguna.
 */
async function fetchJson(type, page, limit) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: MEDIA_QUERY,
        variables: { type, page, perPage: limit },
      }),
    })

    if (response.status === 429) {
      throw new Error("Server sedang sibuk (kode 429). Coba lagi beberapa saat lagi.")
    }

    if (!response.ok) {
      throw new Error(`Permintaan ditolak server (HTTP ${response.status}).`)
    }

    const payload = await response.json()

    if (payload.errors) {
      throw new Error(payload.errors[0]?.message || "Server menolak permintaan.")
    }

    return payload
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Permintaan terlalu lama. Periksa koneksi internetmu.")
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

/**
 * Mengubah satu item mentah dari AniList menjadi bentuk data yang seragam.
 * Anime dan manga punya kolom berbeda; di sini keduanya disamakan.
 */
export function normalizeMedia(raw, kind) {
  const title = raw.title ?? {}
  const english = title.english ?? ""
  const japanese = title.native ?? ""

  const genreTags = (raw.genres ?? []).map((genre) => String(genre))
  const detailTags = (raw.tags ?? []).map((tag) => tag?.name ?? "")

  return {
    id: `${kind}-${raw.idMal ?? raw.id}`,
    malId: raw.idMal ?? raw.id,
    kind,
    title: english || title.romaji || japanese || "Tanpa judul",
    titleEnglish: english,
    titleJapanese: japanese,
    imageUrl: raw.coverImage?.large || "",
    type: FORMAT_LABELS[raw.format] || raw.format || "",
    status: raw.status || "",
    year: raw.seasonYear ?? raw.startDate?.year ?? null,
    score: typeof raw.averageScore === "number" ? raw.averageScore / 10 : null,
    episodes: raw.episodes ?? null,
    chapters: raw.chapters ?? null,
    volumes: raw.volumes ?? null,
    tags: [...new Set([...genreTags, ...detailTags])].filter(Boolean),
    synopsis: stripHtml(raw.description),
    studio: raw.studios?.nodes?.[0]?.name || "",
    url: raw.siteUrl || "",
  }
}

/**
 * Mengambil satu halaman anime.
 */
export async function fetchAnime(page = 1, limit = MEDIA_PAGE_SIZE) {
  const payload = await fetchJson("ANIME", page, limit)
  return (payload.data?.Page?.media ?? []).map((item) => normalizeMedia(item, "anime"))
}

/**
 * Mengambil satu halaman manga.
 */
export async function fetchManga(page = 1, limit = MEDIA_PAGE_SIZE) {
  const payload = await fetchJson("MANGA", page, limit)
  return (payload.data?.Page?.media ?? []).map((item) => normalizeMedia(item, "manga"))
}

/**
 * Mengambil anime DAN manga secara bersamaan, lalu menyatukannya.
 */
export async function fetchAllMedia(page = 1, limit = MEDIA_PAGE_SIZE) {
  const [anime, manga] = await Promise.all([
    fetchAnime(page, limit),
    fetchManga(page, limit),
  ])

  return [...anime, ...manga]
}
