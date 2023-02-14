const apiKey = config.API_KEY;

const photoGalleryEl = document.querySelector(".photo-gallery");
const galleryPageTitle = document.querySelector("title");
const headingEl = document.querySelector(".heading");

// returns documents location with added query parameter as a string (gets website url )
const baseUrl = document.URL;

// gets query parameter from  websites url for search query (e.g., Japan, Norway, ...)
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);
// assign query parameter from url to gallery page title and heading
galleryPageTitle.innerHTML += ` ${searchQuery}`;
headingEl.innerHTML = searchQuery;

// class name for galleryItemContainer
let itemNum = 1;
// creates elements and displays fetched data (images)
function displayImages(response) {
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

// gets data
async function SearchPhotos(query) {
  const data = await fetch(`https://api.pexels.com/v1/search?query=${query}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: apiKey,
    },
  });
  const response = await data.json();
  console.log(response);

  displayImages(response);
}

SearchPhotos(searchQuery);
