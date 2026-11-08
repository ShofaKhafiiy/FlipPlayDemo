/**
 * Pembantu DOM. Boleh menyentuh DOM, tetap tidak boleh melakukan fetch.
 */

export function qs(selector, scope = document) {
  return scope.querySelector(selector)
}

export function setHTML(element, html) {
  element.innerHTML = html
}

export function setText(element, text) {
  element.textContent = text
}

export function toggleClass(element, className, enabled) {
  element.classList.toggle(className, enabled)
}

/**
 * Menunda pemanggilan fn sampai pemanggil berhenti memanggil
 * selama durasi delay.
 */
export function debounce(fn, delay = 200) {
  let timerId = null

  return function debounced(...args) {
    if (timerId !== null) clearTimeout(timerId)

    timerId = setTimeout(() => {
      timerId = null
      fn(...args)
    }, delay)
  }
}
        
