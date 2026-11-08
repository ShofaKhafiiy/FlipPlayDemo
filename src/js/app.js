/**
 * Navigasi mobile untuk masthead landing page.
 * Halaman vibe-grid.html punya menunya sendiri di dalam main.js.
 */

const menuToggle = document.getElementById("menu-toggle")
const menuSheet = document.getElementById("menu-sheet")
const menuIcon = document.getElementById("menu-icon")

const ICON_OPEN = `
  <line x1="4" y1="6" x2="20" y2="6"></line>
  <line x1="4" y1="12" x2="20" y2="12"></line>
  <line x1="4" y1="18" x2="20" y2="18"></line>
`

const ICON_CLOSE = `
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
`

function openMenu() {
  if (!menuToggle || !menuSheet) return

  menuSheet.classList.add("is-open")
  menuToggle.setAttribute("aria-expanded", "true")
  menuToggle.setAttribute("aria-label", "Tutup menu navigasi")
  if (menuIcon) menuIcon.innerHTML = ICON_CLOSE
}

function closeMenu() {
  if (!menuToggle || !menuSheet) return

  menuSheet.classList.remove("is-open")
  menuToggle.setAttribute("aria-expanded", "false")
  menuToggle.setAttribute("aria-label", "Buka menu navigasi")
  if (menuIcon) menuIcon.innerHTML = ICON_OPEN
}

if (menuToggle && menuSheet) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true"

    if (isOpen) closeMenu()
    else openMenu()
  })

  // Perbaikan bug 1: querySelectorAll, bukan querySelector.
  // querySelector mengembalikan satu elemen, dan satu elemen
  // tidak punya method forEach.
  menuSheet.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  // Perbaikan bug 2: listener ini dipasang SEKALI, di luar handler klik.
  // Kalau dipasang di dalam, setiap klik menambah satu listener baru.
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu()
  })
}
        
