// main.js
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

    /* =========================
     NAV — show on ANY scroll up
     ========================= */

  const nav = document.querySelector(".nav");
  let lastY = window.scrollY;

  function updateNavOnScroll() {
    if (!nav) return;

    const currentY = window.scrollY;

    // always show at the very top
    if (currentY <= 0) {
      nav.classList.remove("is-hidden");
      lastY = currentY;
      return;
    }

    if (currentY < lastY) {
      // scrolling up (even 1px)
      nav.classList.remove("is-hidden");
    } else if (currentY > lastY) {
      // scrolling down
      nav.classList.add("is-hidden");
    }

    // always keep lastY updated
    lastY = currentY;
  }

  window.addEventListener("scroll", updateNavOnScroll, { passive: true });


  /* =========================
     Desktop dropdowns
     ========================= */

  const dds = Array.from(document.querySelectorAll(".dd"));

  function closeAllDropdowns() {
    dds.forEach((dd) => {
      dd.classList.remove("is-open");
      const btn = dd.querySelector(".dd__btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  dds.forEach((dd) => {
    const btn = dd.querySelector(".dd__btn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains("is-open");
      closeAllDropdowns();
      if (!isOpen) {
        dd.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });

    dd.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeAllDropdowns);
    });
  });

  document.addEventListener("click", closeAllDropdowns);
  window.addEventListener("scroll", closeAllDropdowns, { passive: true });

  /* =========================
     Mobile menu
     ========================= */

  const burger = document.querySelector(".nav__burger");
  const panel = document.getElementById("navPanel");

  function setPanel(open) {
    if (!burger || !panel) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger && panel) {
    burger.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = !panel.classList.contains("is-open");
      setPanel(open);
      closeAllDropdowns();
    });

    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setPanel(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setPanel(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) setPanel(false);
    });
  }

  /* =========================
     Video autoplay fallback
     ========================= */

  document.querySelectorAll(".tileVideo, .demoVideo").forEach((v) => {
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener("loadeddata", tryPlay, { once: true });
    tryPlay();
  });

  /* =========================
     Mockup gallery swiper
     ========================= */

  const galleryEl = document.querySelector(".gallerySwiper");
  if (galleryEl && window.Swiper) {
    new Swiper(galleryEl, {
      slidesPerView: "auto",
      spaceBetween: 16,
      freeMode: true,
      grabCursor: true,
      momentum: true,
      breakpoints: {
        980: { spaceBetween: 18 },
        1400: { spaceBetween: 22 },
      },
    });
  }
});
