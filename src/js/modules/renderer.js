/**
 * View: mengubah data menjadi string HTML.
 * Satu-satunya tempat di proyek ini yang menulis markup.
 */

import { escapeHtml, formatMeta } from "../utils/helpers.js"

/**
 * Satu kartu judul.
 */
function renderCard(item) {
  const kindLabel = item.kind === "manga" ? "Manga" : "Anime"

  const poster = item.imageUrl
    ? `<img class="card__poster"
             src="${escapeHtml(item.imageUrl)}"
             alt="Poster ${escapeHtml(item.title)}"
             loading="lazy" decoding="async"
             width="400" height="600">`
    : `<div class="card__poster" role="img" aria-label="Poster tidak tersedia"></div>`

  const meta = formatMeta(item)

  return `
    <article class="card">
      <span class="card__badge">${kindLabel}</span>
      <a class="card__link"
         href="${escapeHtml(item.url)}"
         target="_blank" rel="noopener noreferrer">
        ${poster}
        <div class="card__body">
          <h3 class="card__title">${escapeHtml(item.title)}</h3>
          <p class="card__meta">${escapeHtml(meta)}</p>
          <span class="card__source">Lihat di MyAnimeList</span>
        </div>
      </a>
    </article>
  `
}

/**
 * Seluruh kartu untuk satu hasil filter.
 */
export function renderCards(items) {
  return items.map(renderCard).join("")
}

/**
 * Placeholder saat data masih dimuat.
 */
export function renderSkeletons(count = 8) {
  const blocks = []

  for (let index = 0; index < count; index += 1) {
    blocks.push(`
      <div class="skeleton__item" aria-hidden="true">
        <div class="skeleton__block"></div>
        <div class="skeleton__line"></div>
        <div class="skeleton__line skeleton__line--short"></div>
      </div>
    `)
  }

  return blocks.join("")
}

/**
 * Pesan untuk keadaan kosong atau gagal.
 */
export function renderNotice({ title, body, hint = "" }) {
  return `
    <div class="notice" role="status">
      <h2 class="notice__title">${escapeHtml(title)}</h2>
      <p class="notice__body">${escapeHtml(body)}</p>
      ${hint ? `<p class="notice__hint">${escapeHtml(hint)}</p>` : ""}
    </div>
  `
}
        
