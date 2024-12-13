let API_URL_POKEMON = "https://pokeapi.co/api/v2/pokemon"
// const body = document.body

let pokemon = {
    name: "",
    weight: 0,
    baseExp: 0,
    images: [],
    abilities: []
}
choose();

async function choose() {
    let response = await fetch(API_URL_POKEMON)
    let data = await response.json()

    let choice = document.createElement("select");
    let defaultOption = document.createElement("option");
    defaultOption.textContent = "Bitte wählen";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    choice.appendChild(defaultOption);

    data.results.forEach((result, index) => {
        let option = document.createElement("option");
        option.value = result.url;
        option.textContent = result.name;
        choice.appendChild(option);
    });

    body.appendChild(choice);

    choice.addEventListener("change", () => {
        let selectedUrl = choice.value;
        console.log("Gewählte URL:", selectedUrl);
        API_URL_POKEMON = selectedUrl;

        let temp = document.getElementById("pokemonDiv");
        if (temp) {
            temp.remove();
            console.log("Works")
        }

        getPokemon();
    });

}


async function getPokemon() {
    //Objekt erstellen
    let response = await fetch(API_URL_POKEMON)
    let data = await response.json()
    console.log(data)
    pokemon.name = data.name
    pokemon.weight = data.weight
    pokemon.baseExp = data.base_experience
    pokemon.images = data.sprites
    pokemon.abilities = data.abilities


    const pokeDiv = document.createElement("div");
    pokeDiv.id = "pokemonDiv";
    body.appendChild(pokeDiv)


    const imageDiv = document.createElement("div");
    const pokemonName = document.createElement("h2");
    const pokemonImg1 = document.createElement("img");
    const pokemonImg2 = document.createElement("img");
    const infos = document.createElement("div");
    const baseExpDiv = document.createElement("div");
    const abilitiesHeading = document.createElement("h2");
    const abilitiesDiv = document.createElement("div");
    const abilitiesDesc = document.createElement("p");
    const weightDiv = document.createElement("div");

    pokemonImg1.src = pokemon.images.back_default;
    pokemonImg2.src = pokemon.images.front_default;

    pokemonName.innerText = pokemon.name.toUpperCase();
    baseExpTxt = document.createElement("p");
    weightTxt = document.createElement("p");
    baseExpTxt.textContent = "Base Exp - " + pokemon.baseExp;
    weightTxt.textContent = "Weight - " + pokemon.weight;
    baseExpDiv.appendChild(baseExpTxt);
    weightDiv.appendChild(weightTxt);
    abilitiesHeading.textContent = "Abilities"
    for (let i = 0; i < pokemon.abilities.length; i++) {

        try {
            const abilitiesDiv2 = document.createElement("div");
            abilitiesDiv2.classList.add("abilities");

            let temp = document.createElement("h4")
            abilitiesDiv2.appendChild(temp)
            temp.textContent += pokemon.abilities[i].ability.name.toUpperCase() + " ";
            abilitiesDiv2.appendChild(abilitiesDesc)

            let response1 = await fetch(pokemon.abilities[i].ability.url);
            let data1 = await response1.json();

            const passiveEffect = data1.effect_entries?.find(entry => entry.language.name === 'en');

            if (passiveEffect) {
                // Texte direkt einfügen
                const passiveText = passiveEffect.effect; // Voller Text des englischen Effekts
                const sST = passiveEffect.short_effect; // Kurze Beschreibung


                // English Effect H2 und P
                const eEffectH2 = document.createElement('h5');
                eEffectH2.textContent = "Passive Effect";
                const eEffectP = document.createElement('p');
                eEffectP.textContent = passiveText;

                // Short Effect H2 und P
                const mainEffect = document.createElement('h5');
                mainEffect.textContent = "Main Effect";
                const sEffectP = document.createElement('p');
                sEffectP.textContent = sST;

                // Elemente in abilitiesDiv einfügen
                abilitiesDiv2.appendChild(eEffectH2);
                abilitiesDiv2.appendChild(eEffectP);
                abilitiesDiv2.appendChild(mainEffect);
                abilitiesDiv2.appendChild(sEffectP);
                abilitiesDiv.appendChild(abilitiesDiv2);
            } else {
                console.log("No English effect found.");
            }
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }

    }
    console.log("Abilities - ", pokemon.abilities);

    imageDiv.id = "imageDiv";
    pokemonImg1.id = "pokemonImg1";
    pokemonImg2.id = "pokemonImg2";
    infos.id = "infos";
    baseExpDiv.id = "baseExp";
    weightDiv.id = "weightDiv";
    abilitiesDiv.id = "abilitiesDiv";

    pokeDiv.appendChild(imageDiv)
    imageDiv.appendChild(pokemonImg1)
    imageDiv.appendChild(pokemonImg2)
    pokeDiv.appendChild(infos)
    infos.appendChild(pokemonName)
    infos.appendChild(baseExpDiv)
    infos.appendChild(weightDiv)
    infos.appendChild(abilitiesHeading)
    infos.appendChild(abilitiesDiv)
}

// getPokemon()
