let API_URL_CHUCK = "https://api.chucknorris.io/jokes/random"

const body = document.body;
let div = document.createElement("div");
div.style.display = "none"
let jokeEl = document.createElement("p");
div.id = "chuck-joke";
body.appendChild(div)
div.appendChild(jokeEl)

async function getJoke() {
        div.classList.remove("hidden")
        return await fetch(API_URL_CHUCK)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then(data => {
                return data.value; // Joke wird zurückgegeben
            })
            .catch(error => {
                console.log(error); // Fehler behandeln
                return null; // Optional: Fehlerwert zurückgeben
            });
}

async function showJoke() {
    jokeEl.innerText = await getJoke()
    div.style.display = "block"
}

let chuckBtn = document.createElement("button")

chuckBtn.addEventListener("click", showJoke);

chuckBtn.innerText = "Chuck";
body.appendChild(chuckBtn)