// main.js

(() => {
  // Footer year
  const yearEl = document.getElementById('y');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Research Swiper
  const swiperEl = document.querySelector('.researchSwiper');
  if (swiperEl && window.Swiper) {
    // eslint-disable-next-line no-new
    new Swiper('.researchSwiper', {
      slidesPerView: 1.1,
      spaceBetween: 14,
      centeredSlides: false,
      grabCursor: true,
      speed: 650,

      pagination: {
        el: '.researchSwiper .swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.researchSwiper .swiper-button-next',
        prevEl: '.researchSwiper .swiper-button-prev',
      },

      // Better responsive behavior (phone -> tablet -> desktop)
      breakpoints: {
        480: { slidesPerView: 1.2, spaceBetween: 14 },
        560: { slidesPerView: 1.6, spaceBetween: 16 },
        740: { slidesPerView: 1.9, spaceBetween: 18 },
        900: { slidesPerView: 2.2, spaceBetween: 18 },
        1100: { slidesPerView: 2.6, spaceBetween: 20 },
      },
    });
  } else if (!window.Swiper) {
    console.warn('Swiper not loaded. Check the Swiper CDN script tag.');
  }

  // Optional: smooth anchor scrolling (keeps it calm)
  // If you prefer default jump, remove this block.
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  if (!prefersReducedMotion) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;

      const id = a.getAttribute('href');
      if (!id || id === '#') return;

      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();

      // account for sticky nav height
      const nav = document.querySelector('.nav');
      const navH = nav ? nav.getBoundingClientRect().height : 0;

      const top = window.scrollY + target.getBoundingClientRect().top - (navH + 14);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }
})();
