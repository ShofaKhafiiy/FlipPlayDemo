const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export async function initHeroScene() {
  const hero = document.querySelector("[data-hero]") || document.querySelector(".hero");
  const canvas =
    hero?.querySelector("[data-hero-canvas]") || document.querySelector("[data-hero-canvas]");
  if (!hero || !canvas) return () => {};

  try {
    const THREE = await import("three");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0907, 0.06);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
    camera.position.set(0, 0.6, 7);

    scene.add(new THREE.HemisphereLight(0x8a7452, 0x0b0907, 1.1));

    const key = new THREE.DirectionalLight(0xffd9a0, 2.2);
    key.position.set(4, 6, 5);
    scene.add(key);

    const brass = new THREE.PointLight(0xd8a24a, 14, 22, 2);
    brass.position.set(-3, 1.5, 3);
    scene.add(brass);

    const book = new THREE.Group();
    const cover = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 3.5, 0.24),
      new THREE.MeshStandardMaterial({ color: 0x5a2f22, roughness: 0.82, metalness: 0.05 })
    );
    const pages = new THREE.Mesh(
      new THREE.BoxGeometry(2.28, 3.28, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.95 })
    );
    pages.position.z = 0.02;
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 3.5, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x3a1d15, roughness: 0.7 })
    );
    spine.position.x = -1.25;
    const emblem = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.035, 12, 48),
      new THREE.MeshStandardMaterial({ color: 0xc79a4b, roughness: 0.35, metalness: 0.85 })
    );
    emblem.position.set(0, 0.2, 0.14);
    book.add(cover, pages, spine, emblem);
    book.position.set(1.1, 0.1, 0);
    book.rotation.set(-0.08, -0.5, 0.06);
    scene.add(book);

    const shelves = new THREE.Group();
    for (let i = 0; i < 3; i += 1) {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(6.4, 0.16, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x140e0a, roughness: 1 })
      );
      slab.position.set(-1.4, -1.4 + i * 1.1, -2.6 - i * 0.5);
      shelves.add(slab);
    }
    scene.add(shelves);

    const dustCount = 220;
    const positions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: 0xf0d9a8,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (event) => {
      const rect = hero.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave, { passive: true });

    let raf = 0;
    let running = true;
    let visible = true;
    const clock = new THREE.Clock();

    const renderFrame = (elapsed) => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);

      pointer.x += (target.x - pointer.x) * 0.06;
      pointer.y += (target.y - pointer.y) * 0.06;

      book.rotation.y = -0.5 + Math.sin(elapsed * 0.22) * 0.12 + pointer.x * 0.28;
      book.rotation.x = -0.08 + pointer.y * 0.12;
      book.position.y = 0.1 + Math.sin(elapsed * 0.45) * 0.06 + progress * 0.5;

      camera.position.x = pointer.x * 0.55;
      camera.position.y = 0.6 + progress * 1.1;
      camera.position.z = 7 + progress * 1.8;
      camera.lookAt(0, 0.1, 0);

      dust.rotation.y = elapsed * 0.015;
      dust.position.y = -progress * 0.8;

      renderer.render(scene, camera);
    };

    const resize = () => {
      const width = hero.clientWidth || window.innerWidth || 1;
      const height = hero.clientHeight || window.innerHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (REDUCED_MOTION) renderFrame(0);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running || !visible) return;
      renderFrame(clock.getElapsedTime());
    };

    let observer = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.02 }
      );
      observer.observe(hero);
    }

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeObserver = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(hero);
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    if (REDUCED_MOTION) renderFrame(0);
    else loop();

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose?.());
        } else {
          object.material?.dispose?.();
        }
      });
      renderer.dispose();
    };
  } catch (error) {
    console.warn("Hero 3D dilewati:", error);
    hero.classList.add("hero--no-webgl");
    return () => {};
  }
}
