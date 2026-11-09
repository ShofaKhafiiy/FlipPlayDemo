import { getItem, escapeHtml, formatRating } from "../utils.js";

export function initBookModal() {
  const dialog = document.querySelector("[data-book-modal]");
  if (!dialog) return;

  const poster = dialog.querySelector("[data-modal-poster]");
  const title = dialog.querySelector("[data-modal-title]");
  const meta = dialog.querySelector("[data-modal-meta]");
  const synopsis = dialog.querySelector("[data-modal-synopsis]");
  const categories = dialog.querySelector("[data-modal-categories]");
  const link = dialog.querySelector("[data-modal-link]");
  const close = dialog.querySelector("[data-modal-close]");

  const open = (item) => {
    if (!item) return;

    if (poster) {
      poster.style.backgroundImage = item.poster ? `url('${item.poster}')` : "";
    }
    if (title) title.textContent = item.title;
    if (meta) {
      meta.textContent = [
        item.kindLabel,
        item.subtypeLabel,
        item.year,
        item.status,
        item.rating ? `★ ${formatRating(item.rating)}` : "",
        item.episodes ? `${item.episodes} eps` : "",
        item.chapters ? `${item.chapters} ch` : "",
      ]
        .filter(Boolean)
        .join(" · ");
    }
    if (synopsis) synopsis.textContent = item.synopsis || "Belum ada sinopsis.";
    if (categories) {
      categories.innerHTML = (item.categories || [])
        .slice(0, 8)
        .map((name) => `<span class="chip chip--static">${escapeHtml(name)}</span>`)
        .join("");
    }
    if (link) {
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const closeModal = () => {
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-book-open]");
    if (!trigger) return;

    const item = getItem(trigger.dataset.bookOpen);
    if (item) open(item);
  });

  close?.addEventListener("click", closeModal);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal();
  });

}