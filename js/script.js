// Make info section appear
const infoEl = document.querySelector(".info");
const categoryEl = document.querySelector(".section-categories");
const navBtn = document.querySelector(".main-nav-button");

navBtn.addEventListener("click", function () {
  infoEl.classList.toggle("info-appear");
  categoryEl.classList.toggle("categories-slide-down");
});
