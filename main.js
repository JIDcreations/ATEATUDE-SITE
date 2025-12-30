// main.js
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  /* =========================
     CIRCLE CURSOR
     ========================= */

  const dot = document.querySelector(".cursorDot");
  const ring = document.querySelector(".cursorRing");

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (dot && ring && canHover) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const setPos = (el, px, py) => {
      el.style.transform = `translate3d(${px}px, ${py}px, 0) translate3d(-50%, -50%, 0)`;
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        x = e.clientX;
        y = e.clientY;
        setPos(dot, x, y);
      },
      { passive: true }
    );

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      setPos(ring, rx, ry);
      requestAnimationFrame(loop);
    };
    loop();

    const isClickable = (el) =>
      el &&
      (el.closest(
        "a, button, .btn, .dd__btn, .nav__burger, [role='button'], input, textarea, select"
      ) ||
        window.getComputedStyle(el).cursor === "pointer");

    document.addEventListener(
      "pointerover",
      (e) => {
        ring.classList.toggle("is-hover", !!isClickable(e.target));
      },
      { passive: true }
    );

    document.addEventListener(
      "pointerout",
      () => {
        ring.classList.remove("is-hover");
      },
      { passive: true }
    );

    window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    window.addEventListener("pointerup", () => ring.classList.remove("is-down"));

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "";
      ring.style.opacity = "";
    });
  }

  /* =========================
     NAV — show on ANY scroll up
     ========================= */

  const nav = document.querySelector(".nav");
  let lastY = window.scrollY;

  function updateNavOnScroll() {
    if (!nav) return;

    const currentY = window.scrollY;

    if (currentY <= 0) {
      nav.classList.remove("is-hidden");
      lastY = currentY;
      return;
    }

    if (currentY < lastY) {
      nav.classList.remove("is-hidden");
    } else if (currentY > lastY) {
      nav.classList.add("is-hidden");
    }

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
