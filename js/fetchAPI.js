const apiKey = config.API_KEY;

// index page
const categoriesGalleryEl = document.querySelector(".categories-gallery");

// gallery page
const photoGalleryEl = document.querySelector(".photo-gallery");
const galleryPageTitle = document.querySelector("title");
const headingEl = document.querySelector(".heading");

// returns documents location with added query parameter as a string (gets website url )
const baseUrl = document.URL;

// gets query parameter from  websites url for search query (e.g., Japan, Norway, ...)
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);
// assign query parameter from url to gallery page title and heading

if (headingEl) {
  galleryPageTitle.innerHTML += ` ${searchQuery}`;
  headingEl.innerHTML = searchQuery;
}

// class name for galleryItemContainer
let itemNum = 1;
// creates elements and displays fetched data (images) on gallery page
function displayGalleryImages(response) {
  response.photos.forEach((image) => {
    const galleryItemContainer = document.createElement("figure");
    galleryItemContainer.className = "gallery-item-container";
    galleryItemContainer.className = `item${itemNum}`;

    const galleryItemLink = document.createElement("a");
    galleryItemLink.className = "gallery-item-link";
    galleryItemLink.href = image.url;
    galleryItemLink.target = "_blank";

    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.title = image.alt;
    galleryItem.setAttribute(
      "style",
      `background-image: url(${image.src.large2x})`
    );

    galleryItemLink.append(galleryItem);
    galleryItemContainer.append(galleryItemLink);
    photoGalleryEl.append(galleryItemContainer);

    itemNum++;
  });
}

// class name for categoriesGalleryItemNum
let CategoriesItemNum = 1;
// creates elements and displays fetched data (images) on index page
function displayCategoryImages(response, query) {
  response.photos.forEach((image) => {
    const categoriesItemContainer = document.createElement("figure");
    categoriesItemContainer.className = "categories-item-container";
    categoriesItemContainer.className = `item${CategoriesItemNum}`;

    const categoriesItemLink = document.createElement("a");
    categoriesItemLink.className = "categories-item-link";
    categoriesItemLink.href = `gallery.html?${query}`;

    const categoriesItemTitle = document.createElement("p");
    categoriesItemTitle.className = "categories-item-title";
    categoriesItemTitle.innerHTML = query;

    const categoriesItem = document.createElement("div");
    categoriesItem.className = "categories-item";
    categoriesItem.setAttribute(
      "style",
      `background-image: url(${image.src.large2x})`
    );

    categoriesItemLink.append(categoriesItemTitle, categoriesItem);
    categoriesItemContainer.append(categoriesItemLink);
    categoriesGalleryEl.append(categoriesItemContainer);

    CategoriesItemNum++;
  });
}

// idex page = 0  gallery page = 1
// if its 0 creates category list and fetches data for it
// if its 1  fetches data for that searchQuery
async function switcher(page) {
  if (page === 0) {
    // add new list item here to create new category
    let list = [
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
    for (let i = 0; i < list.length; i++) {
      await SearchPhotos(list[i], 1);
    }
  } else if (page === 1) {
    SearchPhotos(searchQuery);
  }
}

// gets data
async function SearchPhotos(query, quantity) {
  // quantity if images to fetch
  if (quantity === 1) {
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

    displayCategoryImages(response, query);
  } else {
    const data = await fetch(
      `https://api.pexels.com/v1/search?query=${query}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: apiKey,
        },
      }
    );
    const response = await data.json();

    displayGalleryImages(response);
  }
}
