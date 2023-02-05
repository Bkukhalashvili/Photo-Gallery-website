// Make info section appear
const infoContainerEl = document.querySelector(".info-container");
const categoryEl = document.querySelector(".section-categories");
const navBtn = document.querySelector(".main-nav-button");
const footerEl = document.querySelector(".footer");

navBtn.addEventListener("click", function () {
  infoContainerEl.classList.toggle("info-appear");
  categoryEl.classList.toggle("categories-slide-down");
  footerEl.classList.toggle("footer-slide-down");
});

// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;
