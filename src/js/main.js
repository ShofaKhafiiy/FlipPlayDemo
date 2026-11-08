/**
 * Composition root: satu-satunya file yang mengenal DOM sekaligus
 * seluruh modul lain.
 */

import { fetchAllMedia } from "./services/mediaService.js"
import { filterMedia } from "./modules/filter.js"
import { renderCards, renderNotice, renderSkeletons } from "./modules/renderer.js"
import { AURAS, ALL_AURA_ID, getAuraLabel } from "./utils/auraMapper.js"
import { debounce, qs, setHTML, setText, toggleClass } from "./utils/domHelpers.js"

/**
 * Keempat nilai ini adalah seluruh keadaan halaman.
 */
const state = {
  items: [],
  query: "",
  auraId: ALL_AURA_ID,
  status: "idle",
  error: "",
}

/**
 * Kumpulan elemen yang dipakai berulang kali.
 */
const els = {}

function cacheElements() {
  els.grid = qs("#media-grid")
  els.count = qs("#result-count")
  els.searchInput = qs("#search-input")
  els.searchForm = qs("#search-form")
  els.auraList = qs("#aura-list")
  els.menuToggle = qs("#menu-toggle")
  els.menuSheet = qs("#menu-sheet")
}

/**
 * Membangun tombol aura dari data AURAS, supaya label dan perilakunya
 * tidak ditulis dua kali.
 */
function renderAuraButtons() {
  const options = [{ id: ALL_AURA_ID, label: "Semua Vibes" }, ...AURAS]

  setHTML(
    els.auraList,
    options
      .map(
        (aura) => `
          <button type="button"
                  class="aura__btn"
                  data-aura="${aura.id}"
                  aria-pressed="${aura.id === state.auraId}">
            ${aura.label}
          </button>
        `
      )
      .join("")
  )
}

/**
 * Memutar animasi masuk pada grid.
 * Kelas harus dilepas dulu supaya animasi bisa diputar ulang.
 */
function playGridFade() {
  toggleClass(els.grid, "is-entering", false)
  void els.grid.offsetWidth
  toggleClass(els.grid, "is-entering", true)
}

/**
 * Satu-satunya tempat yang menggambar isi grid.
 */
function renderResults() {
  const filtered = filterMedia(state.items, {
    query: state.query,
    auraId: state.auraId,
  })

  if (filtered.length === 0) {
    setHTML(
      els.grid,
      renderNotice({
        title: "Tidak ada judul yang cocok",
        body: "Coba kata kunci yang lebih pendek, atau pilih aura yang lain.",
        hint: `Aura aktif: ${getAuraLabel(state.auraId)}`,
      })
    )
  } else {
    setHTML(els.grid, renderCards(filtered))
    playGridFade()
  }

  setText(els.count, `${filtered.length} dari ${state.items.length} judul`)
}

/**
 * Mengatur tampilan berdasarkan status: memuat, siap, atau gagal.
 */
function renderStatus() {
  if (state.status === "loading") {
    setHTML(els.grid, renderSkeletons(8))
    setText(els.count, "Memuat katalog")
    return
  }

  if (state.status === "error") {
    setHTML(
      els.grid,
      renderNotice({
        title: "Katalog tidak bisa dimuat",
        body: state.error,
        hint: "AniList membatasi jumlah permintaan (30 per menit). Muat ulang halaman beberapa saat lagi.",
      })
    )
    setText(els.count, "0 judul")
    return
  }

  renderResults()
}

/**
 * Mengambil data lalu memperbarui tampilan.
 */
async function loadCatalog() {
  state.status = "loading"
  renderStatus()

  try {
    state.items = await fetchAllMedia()
    state.status = "ready"
    state.error = ""
  } catch (error) {
    state.status = "error"
    state.error = error.message
  }

  renderStatus()
}

/**
 * Memasang semua event listener.
 */
function bindEvents() {
  const applyQuery = () => {
    state.query = els.searchInput.value
    renderResults()
  }

  els.searchInput.addEventListener("input", debounce(applyQuery, 200))

  els.searchForm.addEventListener("submit", (event) => {
    event.preventDefault()
    applyQuery()
  })

  els.auraList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-aura]")
    if (!button) return

    state.auraId = button.dataset.aura

    els.auraList.querySelectorAll(".aura__btn").forEach((item) => {
      item.setAttribute("aria-pressed", String(item.dataset.aura === state.auraId))
    })

    renderResults()
  })

  if (els.menuToggle && els.menuSheet) {
    els.menuToggle.addEventListener("click", () => {
      const isOpen = els.menuSheet.classList.toggle("is-open")
      els.menuToggle.setAttribute("aria-expanded", String(isOpen))
      els.menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      )
    })
  }
}

function init() {
  cacheElements()
  renderAuraButtons()
  bindEvents()
  loadCatalog()
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}
        
