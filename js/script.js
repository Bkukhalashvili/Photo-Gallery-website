// Make info section appear
const infoContainerEl = document.querySelector(".info-container");
// From index.html
const categoryEl = document.querySelector(".section-categories");
// from gallery.html
const galleryEl = document.querySelector(".section-gallery");

const navBtn = document.querySelector(".main-nav-button");
const footerEl = document.querySelector(".footer");

navBtn.addEventListener("click", function () {
  infoContainerEl.classList.toggle("info-appear");

  if (categoryEl) {
    // From index.html
    categoryEl.classList.toggle("categories-slide-down");
  } else {
    // from gallery.html
    galleryEl.classList.toggle("gallery-slide-down");
  }

  footerEl.classList.toggle("footer-slide-down");
});

// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;
