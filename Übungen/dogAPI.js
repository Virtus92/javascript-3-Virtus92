let API_URL_DOG = "https://dog.ceo/api/breeds/image/random"

// const body = document.body;
const dogDiv = document.createElement("div");
dogDiv.id = "dog-image";
dogDiv.classList.add("hidden")
body.appendChild(dogDiv)

async function getImage() {
    try {
        const response = await fetch(API_URL_DOG)
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function showImage() {
    let div = document.getElementById("dog-image")
    div.classList.remove("hidden")
    let link = await getImage();
    let img = document.createElement("img")
    img.src = link.message;
    img.alt = "Random Dog Image"
    img.style.maxHeight = "400px";
    div.innerHTML = ``
    div.appendChild(img);
}

let button = document.createElement("button");
button.addEventListener("click", showImage);
button.innerText = "Show Dog";
body.appendChild(button)