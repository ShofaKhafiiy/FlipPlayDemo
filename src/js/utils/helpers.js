/**
 * Utilitas murni: tanpa DOM, tanpa jaringan, tanpa efek samping.
 * Input yang sama harus selalu menghasilkan output yang sama.
 */

const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}

/**
 * Meloloskan teks agar aman disisipkan sebagai HTML.
 * Dipakai setiap kali nilai dari API masuk ke template literal.
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return ""
  return String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char])
}

/**
 * Memotong teks panjang dan menambahkan elipsis.
 */
export function truncate(text, max = 110) {
  if (!text) return ""
  const clean = String(text).trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max - 1).trimEnd()}…`
}

/**
 * Merangkai baris metadata kartu: jenis, jumlah episode/chapter, skor, tahun.
 */
export function formatMeta(item) {
  const parts = []

  if (item.type) parts.push(item.type)

  const total = item.kind === "manga" ? item.chapters : item.episodes
  if (total) {
    parts.push(`${total} ${item.kind === "manga" ? "ch" : "eps"}`)
  }

  if (typeof item.score === "number" && item.score > 0) {
    parts.push(`skor ${item.score.toFixed(2)}`)
  }

  if (item.year) parts.push(String(item.year))

  if (item.studio) parts.push(item.studio)

  return parts.join(" · ")
}
        
