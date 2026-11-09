const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initNav(root = document) {
  const nav = root.querySelector("[data-nav]") || root.querySelector(".nav");
  if (!nav) return () => {};

  const toggle = nav.querySelector("[data-nav-toggle]");
  const panel = nav.querySelector("[data-nav-links]") || nav.querySelector(".nav__links");
  const video = nav.querySelector("[data-nav-video]");
  const cleanups = [];

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    }

    if (open) panel?.querySelector("a, button")?.focus?.();
  };

  const onToggle = () => setOpen(!nav.classList.contains("is-open"));
  toggle?.addEventListener("click", onToggle);
  if (toggle) cleanups.push(() => toggle.removeEventListener("click", onToggle));

  const onNavClick = (event) => {
    if (event.target.closest("a")) setOpen(false);
  };
  nav.addEventListener("click", onNavClick);
  cleanups.push(() => nav.removeEventListener("click", onNavClick));

  const onKeydown = (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle?.focus();
    }
  };
  document.addEventListener("keydown", onKeydown);
  cleanups.push(() => document.removeEventListener("keydown", onKeydown));

  const onResize = () => {
    if (window.innerWidth >= 900) setOpen(false);
  };
  window.addEventListener("resize", onResize, { passive: true });
  cleanups.push(() => window.removeEventListener("resize", onResize));

  const onOutside = (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(event.target)) setOpen(false);
  };
  document.addEventListener("pointerdown", onOutside);
  cleanups.push(() => document.removeEventListener("pointerdown", onOutside));

  let scrolled = false;
  const onScroll = () => {
    const next = window.scrollY > 16;
    if (next === scrolled) return;
    scrolled = next;
    nav.classList.toggle("is-scrolled", scrolled);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => window.removeEventListener("scroll", onScroll));
  onScroll();

  const loadVideo = () => {
    if (!video || video.dataset.loaded === "true") return;
    video.dataset.loaded = "true";

    const { srcWebm, srcMp4 } = video.dataset;

    if (srcWebm) {
      const source = document.createElement("source");
      source.src = srcWebm;
      source.type = "video/webm";
      video.append(source);
    }

    if (srcMp4) {
      const source = document.createElement("source");
      source.src = srcMp4;
      source.type = "video/mp4";
      video.append(source);
    }

    video.load();
    if (!REDUCED_MOTION) video.play().catch(() => {});
  };

  if (video) {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(loadVideo, { timeout: 1500 });
      cleanups.push(() => window.cancelIdleCallback?.(id));
    } else {
      const id = window.setTimeout(loadVideo, 600);
      cleanups.push(() => window.clearTimeout(id));
    }

    const onVisibility = () => {
      if (video.dataset.loaded !== "true") return;
      if (document.hidden) video.pause();
      else if (!REDUCED_MOTION) video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));
  }

  setOpen(nav.classList.contains("is-open"));

  return () => cleanups.forEach((fn) => fn());
}