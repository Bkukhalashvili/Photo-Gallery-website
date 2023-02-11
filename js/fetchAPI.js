const apiKey = config.API_KEY;
const style = (node, styles) =>
  Object.keys(styles).forEach((key) => (node.style[key] = styles[key]));
const galleryContainerEl = document.querySelector(".gallery-container");
const galleryPageTitle = document.querySelector("title");
const headingEl = document.querySelector(".heading");
const baseUrl = document.URL;

let page_num = 1;
const searchQuery = baseUrl.slice(baseUrl.indexOf("?") + 1);
galleryPageTitle.innerHTML += ` ${searchQuery}`;
headingEl.innerHTML = searchQuery;

function displayImages(response) {
  response.photos.forEach((image) => {
    const galleryItem = document.createElement("figure");
    galleryItem.className = "gallery-item";

    const item = document.createElement("div");
    item.className = "item";
    item.setAttribute("style", `background-image: url(${image.src.large})`);

    // const galleryPhoto = document.createElement("img");
    // galleryPhoto.className = "gallery-photo";
    // galleryPhoto.src = image.src.large;
    // galleryPhoto.alt = image.alt;

    // galleryItem.append(galleryPhoto);
    galleryItem.append(item);
    galleryContainerEl.append(galleryItem);
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
