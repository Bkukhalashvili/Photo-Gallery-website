const apiKey = API_KEY.API_KEY;

// index page
const categoriesGalleryEl = document.querySelector(".categories-gallery");
const categoriesHeadingEl = document.querySelector(".categories-heading");

// gallery page
const photoGalleryEl = document.querySelector(".photo-gallery");
const galleryPageTitle = document.querySelector("title");
const galleryHeadingEl = document.querySelector(".gallery-heading");

// gets website url which contains query parameter
const baseUrl = document.URL;
// gets query parameter from  websites url for search query (e.g., Japan, Norway, ...)
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);

// error count from SearchPhotos function
let errors = 0;

// list where fetched data for index/gallery page gets stored so it can be stored on session storage
let categoriesData = [];
let galleryData = [];

// gets data from session storage
let sessionGalleryData = JSON.parse(
  sessionStorage.getItem(`galleryData${searchQuery}`)
);
let sessionCategoriesData = JSON.parse(
  sessionStorage.getItem("categoriesData")
);

// add new list item here to create new category on index page
let categoriesList = [
  "Japan",
  "Norway",
  "Germany",
  "Italy",
  "Greece",
  "France",
  "Turkey",
  "Spain",
  "Denmark",
];

// counter for class name for galleryItemContainer and categoriesItemContainer
let itemNum = 1;

// creates elements and displays fetched data (images) on index page
const displayCategoryImages = function (response, query) {
  // adds fetched data to fetched data list so it can be stored on session storage
  categoriesData.push(response);

  response.photos.forEach((image) => {
    categoriesGalleryEl.innerHTML += `
    <figure class="categories-item-container item${itemNum}">
      <a class="categories-item-link" href="gallery.html?${query}">
        <p class="categories-item-title"> ${query} </p>
        <div class="categories-item" title="${image.alt}" style="background-image: url(${image.src.large2x})"></div>
      </a>
    </figure>`;

    itemNum++;
  });
};
// creates elements and displays fetched data (images) on gallery page
const displayGalleryImages = function (response) {
  galleryData.push(response);

  response.photos.forEach((image) => {
    photoGalleryEl.innerHTML += `
    <figure class="gallery-item-container item${itemNum}">
      <a class="gallery-item-link" href="${image.url}" target="_blank">
        <div class="gallery-item" title="${image.alt}" style="background-image: url(${image.src.large2x})"></div>
      </a>
    </figure>`;

    itemNum++;
  });
};

// shows categories/gallery and footer and hides loading text
const visibilityToggle = function (page) {
  if (page === 0 && errors === 0) {
    categoriesGalleryEl.classList.toggle("hidden");
    categoriesHeadingEl.classList.toggle("hidden");
    footerEl.classList.toggle("hidden");
  } else if (page === 1 && errors === 0) {
    galleryHeadingEl.innerHTML = `${searchQuery}`;
    photoGalleryEl.classList.toggle("hidden");
    footerEl.classList.toggle("hidden");
  }
};

// on load function
// idex page = 0  gallery page = 1
async function switcher(page) {
  // index page
  if (page === 0) {
    // checks if data exists on session storage and if its same as categories list
    if (
      sessionCategoriesData &&
      sessionCategoriesData.length === categoriesList.length
    ) {
      for (let i = 0; i < sessionCategoriesData.length; i++) {
        displayCategoryImages(sessionCategoriesData[i], categoriesList[i]);
      }

      visibilityToggle(page);

      // if it doesn't exist or its not same as categories list, deletes it and creates a new one
    } else {
      sessionStorage.removeItem(`categoriesData`);
      for (let i = 0; i < categoriesList.length; i++) {
        await SearchPhotos(categoriesList[i], 1);
      }
      // stores list(with fetched data for index page) to session storage
      sessionStorage.setItem(`categoriesData`, JSON.stringify(categoriesData));

      visibilityToggle(page);
    }

    // gallery page
  } else if (page === 1) {
    // assign query parameter from url to gallery page title
    galleryPageTitle.innerHTML += ` ${searchQuery}`;

    if (sessionGalleryData && sessionGalleryData.length >= 1) {
      for (let i = 0; i < sessionGalleryData.length; i++) {
        displayGalleryImages(sessionGalleryData[i]);
      }

      visibilityToggle(page);
    } else {
      sessionStorage.removeItem(`galleryData${searchQuery}`);

      await SearchPhotos(searchQuery, 15);
      sessionStorage.setItem(
        `galleryData${searchQuery}`,
        JSON.stringify(galleryData)
      );

      visibilityToggle(page);
    }
  }
}

async function SearchPhotos(query, quantity) {
  try {
    const data = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=${quantity}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: apiKey,
        },
      }
    );
    const response = await data.json();

    // quantity of images to fetch
    quantity === 1
      ? displayCategoryImages(response, query)
      : displayGalleryImages(response);
  } catch (error) {
    errors++;
    galleryHeadingEl
      ? (galleryHeadingEl.innerHTML = "ERROR")
      : (categoriesHeadingEl.innerHTML = "ERROR");
    console.error(error);
  }
}
