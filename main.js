// main.js
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    if (currentY < lastY) nav.classList.remove("is-hidden");
    else if (currentY > lastY) nav.classList.add("is-hidden");

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

    dd.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeAllDropdowns));
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

    panel.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setPanel(false)));

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

  /* =========================
     CUSTOM CURSOR (dot + ring)
     ========================= */
  const dot = document.querySelector(".cursorDot");
  const ring = document.querySelector(".cursorRing");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (dot && ring && finePointer && !prefersReduced) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    let dotX = targetX;
    let dotY = targetY;

    let ringX = targetX;
    let ringY = targetY;

    let rafId = null;
    let isVisible = false;

    const DOT_LERP = 0.55;
    const RING_LERP = 0.22;

    const loop = () => {
      dotX += (targetX - dotX) * DOT_LERP;
      dotY += (targetY - dotY) * DOT_LERP;

      ringX += (targetX - ringX) * RING_LERP;
      ringY += (targetY - ringY) * RING_LERP;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate3d(-50%, -50%, 0)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;

      rafId = requestAnimationFrame(loop);
    };

    const show = () => {
      if (isVisible) return;
      isVisible = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const hide = () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        show();
        if (!rafId) rafId = requestAnimationFrame(loop);
      },
      { passive: true }
    );

    window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
    window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);

    const hoverSel =
      'a, button, .btn, .dd__btn, .nav__burger, .swiper-slide, video, .metaCard, .callout, .infoCard, .listCard, .step, .techCard, .reflectCard, .typeCard, .sw';

    document.querySelectorAll(hoverSel).forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("is-hover"), { passive: true });
      el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"), { passive: true });
    });
  }

  /* =========================
     ✅ Hover aura follows cursor on cards
     IMPORTANT: matches the CSS vars: --gx / --gy
     ========================= */
  if (!prefersReduced) {
    const auraTargets = document.querySelectorAll(
      ".metaCard, .callout, .infoCard, .listCard, .step, .techCard, .reflectCard, .typeCard, .sw"
    );

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    auraTargets.forEach((el) => {
      // default center
      el.style.setProperty("--gx", "50%");
      el.style.setProperty("--gy", "50%");

      const setGlowFromEvent = (e) => {
        const r = el.getBoundingClientRect();
        // Guard against 0 size
        if (!r.width || !r.height) return;

        const px = ((e.clientX - r.left) / r.width) * 100;
        const py = ((e.clientY - r.top) / r.height) * 100;

        el.style.setProperty("--gx", `${clamp(px, 0, 100)}%`);
        el.style.setProperty("--gy", `${clamp(py, 0, 100)}%`);
      };

      // Use mousemove as fallback too (some browsers are weird with pointermove)
      el.addEventListener("pointermove", setGlowFromEvent, { passive: true });
      el.addEventListener("mousemove", setGlowFromEvent, { passive: true });

      el.addEventListener(
        "pointerenter",
        (e) => {
          setGlowFromEvent(e);
        },
        { passive: true }
      );

      el.addEventListener(
        "pointerleave",
        () => {
          el.style.setProperty("--gx", "50%");
          el.style.setProperty("--gy", "50%");
        },
        { passive: true }
      );
    });
  }

  /* =========================
     Smooth anchor scroll (JS fallback)
     ========================= */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 14;

      window.scrollTo({ top, behavior: "smooth" });
      closeAllDropdowns();
      if (panel && panel.classList.contains("is-open")) setPanel(false);
    });
  });
});
