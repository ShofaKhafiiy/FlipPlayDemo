const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initParallax(root = document) {
  const reveals = [...root.querySelectorAll("[data-reveal]")];
  reveals.forEach((el) => el.classList.add("will-reveal"));

  let observer = null;

  if ("IntersectionObserver" in window && !REDUCED_MOTION) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const layers = [...root.querySelectorAll("[data-depth]")];
  let raf = 0;
  let ticking = false;

  const update = () => {
    ticking = false;
    if (REDUCED_MOTION || !layers.length) return;

    const viewport = window.innerHeight || 1;

    layers.forEach((el) => {
      const depth = Number(el.dataset.depth) || 0;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -viewport || rect.top > viewport * 2) return;

      const center = rect.top + rect.height / 2;
      const progress = (center - viewport / 2) / viewport;
      const y = progress * depth * -48;

      el.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    raf = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  update();

  return () => {
    observer?.disconnect();
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}
