import * as nav from "./ui/nav.js";
import * as parallax from "./ui/parallax.js";
import * as hero from "./three/heroScene.js";
import { initContactForm } from "./ui/contactForm.js";

const initNav = nav.initNav || (() => {});
const initParallax = parallax.initParallax || (() => {});
const initHeroScene = hero.initHeroScene || (() => {});

function boot() {
  initNav();
  initParallax();
  initHeroScene();
  initContactForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}