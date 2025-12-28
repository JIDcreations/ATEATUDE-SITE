// main.js
document.addEventListener("DOMContentLoaded", () => {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();

  new Swiper(".researchDeck", {
    slidesPerView: 1,
    spaceBetween: 18,
    speed: 650,
    grabCursor: true,
    autoHeight: true,
    pagination: {
      el: ".researchDeck .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".researchDeck .swiper-button-next",
      prevEl: ".researchDeck .swiper-button-prev",
    },
  });
});
