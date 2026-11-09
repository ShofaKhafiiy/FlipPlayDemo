export function initContactForm(root = document) {
  const form = root.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-contact-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (status) {
      status.textContent =
        "Terima kasih! Form ini masih berupa demo dan belum terhubung ke backend.";
      status.hidden = false;
    }

    form.reset();
  });
}