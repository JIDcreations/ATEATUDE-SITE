// main.js
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* =========================
     ✅ CIRCLE CURSOR (uses HTML elements)
     ========================= */
  if (canHover && !prefersReduced) {
    const dot = document.querySelector(".cursorDot");
    const ring = document.querySelector(".cursorRing");

    if (dot && ring) {
      let x = window.innerWidth / 2;
      let y2 = window.innerHeight / 2;
      let rx = x;
      let ry = y2;

      const setPos = (el, px, py) => {
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate3d(-50%, -50%, 0)`;
      };

      window.addEventListener(
        "pointermove",
        (e) => {
          x = e.clientX;
          y2 = e.clientY;
          setPos(dot, x, y2);
        },
        { passive: true }
      );

      const loop = () => {
        rx += (x - rx) * 0.18;
        ry += (y2 - ry) * 0.18;
        setPos(ring, rx, ry);
        requestAnimationFrame(loop);
      };
      loop();

      const isClickable = (el) =>
        !!(
          el &&
          el.closest(
            "a, button, .btn, .dd__btn, .nav__burger, [role='button'], input, textarea, select"
          )
        );

      document.addEventListener(
        "pointerover",
        (e) => {
          ring.classList.toggle("is-hover", isClickable(e.target));
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
  }

  /* =========================
     ✅ Smooth anchor scroll (sticky offset)
     ========================= */
  const nav = document.querySelector(".nav");

  function getNavOffset() {
    if (!nav) return 0;
    const r = nav.getBoundingClientRect();
    return Math.ceil(r.height + 16);
  }

  function smoothScrollToHash(hash) {
    const id = hash.replace("#", "");
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - getNavOffset();
    window.scrollTo({ top, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      history.pushState(null, "", href);
      smoothScrollToHash(href);
    });
  });

  if (window.location.hash) {
    setTimeout(() => smoothScrollToHash(window.location.hash), 0);
  }

  /* =========================
     ✅ Parallax glow background (CSS vars)
     ========================= */
  if (!prefersReduced) {
    let mx = 0.5;
    let my = 0.5;
    let sy = window.scrollY;

    let raf = null;
    const apply = () => {
      raf = null;
      document.documentElement.style.setProperty("--mx", String(mx));
      document.documentElement.style.setProperty("--my", String(my));
      document.documentElement.style.setProperty("--sy", String(sy));
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    window.addEventListener(
      "pointermove",
      (e) => {
        mx = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
        my = Math.min(1, Math.max(0, e.clientY / window.innerHeight));
        schedule();
      },
      { passive: true }
    );

    window.addEventListener(
      "scroll",
      () => {
        sy = window.scrollY;
        schedule();
      },
      { passive: true }
    );

    schedule();
  }

  /* =========================
     NAV — show on ANY scroll up
     ========================= */
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
     ✅ Demo video focus spotlight
     ========================= */
  const demoSection = document.getElementById("demo");
  const videoFrame = document.querySelector("#demo .videoFrame");

  if (demoSection && videoFrame && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        videoFrame.classList.toggle("is-focus", entry.isIntersecting && entry.intersectionRatio > 0.25);
      },
      { threshold: [0, 0.25, 0.5] }
    );
    obs.observe(demoSection);
  }

  /* =========================
     Mockup gallery swiper + dragging feel
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
      on: {
        touchStart: () => galleryEl.classList.add("is-dragging"),
        touchEnd: () => galleryEl.classList.remove("is-dragging"),
        sliderMove: () => galleryEl.classList.add("is-dragging"),
        transitionEnd: () => galleryEl.classList.remove("is-dragging"),
      },
    });

    galleryEl.addEventListener("pointerup", () => galleryEl.classList.remove("is-dragging"));
    galleryEl.addEventListener("pointercancel", () => galleryEl.classList.remove("is-dragging"));
    galleryEl.addEventListener("mouseleave", () => galleryEl.classList.remove("is-dragging"));
  }
});
