// Make info section appear
const infoContainerEl = document.querySelector(".info-container");
const categoryEl = document.querySelector(".section-categories");
const navBtn = document.querySelector(".main-nav-button");

navBtn.addEventListener("click", function () {
  infoContainerEl.classList.toggle("info-appear");
  categoryEl.classList.toggle("categories-slide-down");
});
