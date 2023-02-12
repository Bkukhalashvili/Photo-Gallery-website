const apiKey = config.API_KEY;
const style = (node, styles) =>
  Object.keys(styles).forEach((key) => (node.style[key] = styles[key]));
const photoGalleryEl = document.querySelector(".photo-gallery");
const galleryPageTitle = document.querySelector("title");
const headingEl = document.querySelector(".heading");
const baseUrl = document.URL;

let page_num = 1;
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);
galleryPageTitle.innerHTML += ` ${searchQuery}`;
headingEl.innerHTML = searchQuery;

function displayImages(response) {
  response.photos.forEach((image) => {
    const galleryItemContainer = document.createElement("figure");
    galleryItemContainer.className = "gallery-item-container";

    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.setAttribute(
      "style",
      `background-image: url(${image.src.large})`
    );

    galleryItemContainer.append(galleryItem);
    photoGalleryEl.append(galleryItemContainer);
  });
}

async function SearchPhotos(query, page_num) {
  const data = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&page=${page_num}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: apiKey,
      },
    }
  );
  const response = await data.json();
  console.log(response);

  displayImages(response);
}

SearchPhotos(searchQuery, page_num);
