import { escapeHtml, bookStyle, rememberItem } from "../utils.js";

export function renderBooks(container, items) {
  if (!container) return;

  container.setAttribute("aria-busy", "false");
  items.forEach(rememberItem);
  container.innerHTML = items.map(bookMarkup).join("");
}

function bookMarkup(item) {
  const poster = item.poster
    ? `style="background-image:url('${escapeHtml(item.poster)}')"`
    : "";

  const rating = item.rating
    ? `<span class="book__rating">${item.rating.toFixed(1)}</span>`
    : "";

  const meta = [item.kindLabel, item.year].filter(Boolean).join(" · ");

  return `
    <article class="book" style="${bookStyle(item)}">
      <button class="book__open" type="button" data-book-open="${escapeHtml(item.id)}" aria-label="Lihat detail ${escapeHtml(item.title)}">
        <span class="book__cover">
          <span class="book__cover-inner" ${poster}></span>
          <span class="book__spine"></span>
          <span class="book__kind">${escapeHtml(item.kindLabel)}</span>
          ${rating}
        </span>
        <span class="book__title">${escapeHtml(item.title)}</span>
        <span class="book__meta">${escapeHtml(meta)}</span>
      </button>
    </article>
  `;
}

export function renderSkeletons(container, count = 6) {
  if (!container) return;

  container.setAttribute("aria-busy", "true");
  container.innerHTML = Array.from({ length: count }, () => `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton--cover"></div>
      <div class="skeleton skeleton--line"></div>
      <div class="skeleton skeleton--line skeleton--short"></div>
    </div>
  `).join("");
}

export function renderNotice(container, message, { retry } = {}) {
  if (!container) return;

  container.setAttribute("aria-busy", "false");
  container.innerHTML = `
    <div class="notice">
      <p>${escapeHtml(message)}</p>
      ${retry ? '<button class="btn btn--ghost notice__retry" type="button">Coba lagi</button>' : ""}
    </div>
  `;

  if (retry) {
    container.querySelector(".notice__retry")?.addEventListener("click", retry, { once: true });
  }
}