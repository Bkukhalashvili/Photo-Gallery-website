const apiKey = config.API_KEY;

// index page
const categoriesGalleryEl = document.querySelector(".categories-gallery");

// gallery page
const photoGalleryEl = document.querySelector(".photo-gallery");
const galleryPageTitle = document.querySelector("title");
const headingEl = document.querySelector(".gallery-heading");

// returns documents location with added query parameter as a string (gets website url )
const baseUrl = document.URL;

// gets query parameter from  websites url for search query (e.g., Japan, Norway, ...)
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);

// assign query parameter from url to gallery page title and heading
if (headingEl) {
  galleryPageTitle.innerHTML += ` ${searchQuery}`;
  headingEl.innerHTML = searchQuery;
}
// counter for class name for galleryItemContainer and categoriesItemContainer
let itemNum = 1;

// list where fetched data for index page gets stored so it can be stored on local storage
let categoriesData = [];

// creates elements and displays fetched data (images) on index page
const displayCategoryImages = function (response, query) {
  response.photos.forEach((image) => {
    categoriesGalleryEl.innerHTML += `
    <figure class="categories-item-container item${itemNum}">
      <a class="categories-item-link" href="gallery.html?${query}">
        <p class="categories-item-title"> ${query} </p>
        <div class="categories-item" title="${image.alt}" style="background-image: url(${image.src.large2x})"></div>
      </a>
    </figure>`;

    // adds fetched data to fetched data list so it can be stored on local storage
    categoriesData.push(response);

    itemNum++;
  });
};

// creates elements and displays fetched data (images) on gallery page
const displayGalleryImages = function (response) {
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

// on load function
// idex page = 0  gallery page = 1
// if its 0 creates categories list and fetches data for it
// if its 1  fetches data for that category(searchQuery)
async function switcher(page) {
  // index page
  if (page === 0) {
    // add new list item here to create new category
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

    const sessionCategoriesData = JSON.parse(
      sessionStorage.getItem("categoriesData")
    );

    // checks if data exists on local storage and if its same as categories list
    if (
      sessionCategoriesData &&
      sessionCategoriesData.length === categoriesList.length
    ) {
      for (let i = 0; i < sessionCategoriesData.length; i++) {
        displayCategoryImages(sessionCategoriesData[i], categoriesList[i]);
      }
      // if it doesn't exist or its not same as categories list, deletes it and creates a new one
    } else {
      sessionStorage.clear();
      for (let i = 0; i < categoriesList.length; i++) {
        await SearchPhotos(categoriesList[i], 1);
      }
      // stores list(with fetched data for index page) to local storage
      sessionStorage.setItem(`categoriesData`, JSON.stringify(categoriesData));
    }
    // gallery page
  } else if (page === 1) {
    SearchPhotos(searchQuery, 15);
  }
}

// gets data
async function SearchPhotos(query, quantity) {
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
}
