const apiKey = config.API_KEY;

// index page
const categoriesGalleryEl = document.querySelector(".categories-gallery");
const categoriesHeadingEl = document.querySelector(".categories-heading");

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
  // headingEl.innerHTML = searchQuery;
  headingEl.innerHTML = "loading...";
}
// counter for class name for galleryItemContainer and categoriesItemContainer
let itemNum = 1;

// list where fetched data for index page gets stored so it can be stored on local storage
let categoriesData = [];
let galleryData = [];

// gets data from session storage
let sessionGalleryData = JSON.parse(
  sessionStorage.getItem(`galleryData${searchQuery}`)
);

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

    // galleryData.push(response);

    itemNum++;
  });
};

const visibilityToggle = function () {
  categoriesGalleryEl.classList.toggle("hidden");
  categoriesHeadingEl.classList.toggle("hidden");
  footerEl.classList.toggle("hidden");
};

const saveDataInSession = async function (query, quantity) {
  if (!sessionGalleryData) {
    await SearchPhotos(query, quantity);

    quantity === 1
      ? sessionStorage.setItem(`categoriesData`, JSON.stringify(categoriesData))
      : sessionStorage.setItem(
          `galleryData${searchQuery}`,
          JSON.stringify(galleryData)
        );
    sessionGalleryData = JSON.parse(
      sessionStorage.getItem(`galleryData${searchQuery}`)
    );
  }
};

const loadGalleryData = async function () {
  await saveDataInSession(searchQuery, 15);

  if (sessionGalleryData) {
    for (let i = 0; i < sessionGalleryData.length; i++) {
      displayGalleryImages(sessionGalleryData[i]);
    }
  } else {
    sessionStorage.removeItem(`galleryData${searchQuery}`);

    loadGalleryData();
  }

  headingEl.innerHTML = searchQuery;
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

      //load data from local storage and shows categories and footer and hides loading text
      visibilityToggle();

      // if it doesn't exist or its not same as categories list, deletes it and creates a new one
    } else {
      sessionStorage.clear();
      for (let i = 0; i < categoriesList.length; i++) {
        await SearchPhotos(categoriesList[i], 1);
      }
      // stores list(with fetched data for index page) to local storage
      sessionStorage.setItem(`categoriesData`, JSON.stringify(categoriesData));

      //load data from server and shows categories and footer and hides loading text
      visibilityToggle();
    }
    // gallery page
  } else if (page === 1) {
    // headingEl.innerHTML = "loading...";
    // await SearchPhotos(searchQuery, 15);
    // headingEl.innerHTML = searchQuery;
    loadGalleryData();
  }
}

// gets data
async function SearchPhotos(query, quantity) {
  console.log("fetch");
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
  quantity === 1
    ? displayCategoryImages(response, query)
    : galleryData.push(response);

  // quantity of images to fetch
  // quantity === 1
  //   ? displayCategoryImages(response, query)
  //   : displayGalleryImages(response);
}
