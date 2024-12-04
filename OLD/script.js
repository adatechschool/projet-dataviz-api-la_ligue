import { pokemonAstrologyThemes } from "./theme.js";

// Intéraction avec le DOM
    const displayElement = document.querySelector("#display-hour");
    const themeSwitch = document.querySelector('.theme-switch');
    const imgLogo = document.querySelector('#logo-title');

// --- Ici on affiche l'heure du navigateur ---
function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();

    let displayHour = (hour < 10 ? "0" : "") + hour;
    let displayMin = (min < 10 ? "0" : "") + min;

    displayElement.innerText = `${displayHour}h${displayMin}`;

    darkmodeTime(hour);
}

// --- Gestion du dark mode ---

// Variables globales pour gérer l'état du thème
let isAutoDarkMode = true;  // Pour suivre si le mode auto est actif. Au démarage c'est actif.
let isDarkModeTime = false; // Pour suivre si c'est l'heure du mode sombre

// Darkmode selon l'heure
const darkmodeTime = (navHour) => {
    if (navHour >= 18 || navHour < 6) {
        // Mode nuit
        // Mise à jour de l'état du mode sombre selon l'heure
        isDarkModeTime = true;
    } else {
        // Mode jour
        isDarkModeTime = false;
    }

    // Applique le thème automatique seulement si le mode auto est actif
    if (isAutoDarkMode === true) {
        applyTheme(isDarkModeTime);
    }
}

// Fonction pour appliquer le thème
function applyTheme(themeStatus) {

    if (themeStatus) { // Si themeStatus = true (= light) => on passe en darkmode
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// Bouton darkmode
themeSwitch.addEventListener('click', () => {
    // Désactive le mode automatique quand on utilise le bouton
    isAutoDarkMode = false;

    // Inverse le thème actuel
    const currentTheme = document.documentElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        applyTheme(false); // false = dark
    } else {
        applyTheme(true); // true = light
    }
});

// Ici on change le logo dans le menu
const changeLogo = () => {
    const image1 = "images/logo-01.svg";
    const image2 = "images/logo-02.svg";

    imgLogo.classList.add('fade');

    setTimeout(() => {
        // Change l'image quand elle est invisible
        if (imgLogo.src.includes(image1)) {
            imgLogo.src = image2;
        } else {
            imgLogo.src = image1;
        }

        // Retire l'effet de fondu
        imgLogo.classList.remove('fade');
    }, 500);
}

setCurrentTime();
setInterval(setCurrentTime, 2000);
setInterval(changeLogo, 3000);

document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector('#options');
    const form = document.querySelector('form');  // Ajout de la sélection du formulaire

    // Ici on gère la liste déroulante
    const exPokemonTypes = async () => {
        try {
            console.log("Fetching selected Pokémon types...");
            const response = await fetch('https://tyradex.vercel.app/api/v1/types');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Types fetched successfully:", data);

            const selectedTypes = ['eau', 'plante', 'feu', 'spectre'];
            return data
                .map(type => type.name.fr)
                .filter(typeName => selectedTypes.includes(typeName.toLowerCase()));
        } catch (error) {
            console.error('Erreur lors de la récupération des types:', error);
            return [];
        }
    };

    const typesDropDown = async () => {

        if (!dropdown) {
            console.error("Dropdown element not found in the DOM.");
            return;
        }

        dropdown.innerHTML = '';

        try {
            const types = await exPokemonTypes();
            types.forEach((type) => {
                const option = document.createElement("option");
                option.value = type.toLowerCase();
                option.textContent = type;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Erreur lors du remplissage de la liste déroulante :", error);
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Erreur de chargement";
            dropdown.appendChild(option);
        }
    };

    typesDropDown();

    // Fonction pour valider le choix de l'utilisateur
    form.addEventListener("submit", async (event) => { // Ne comprends l'utilisation de cet eventlisteners
        event.preventDefault();  // Empêche la soumission du formulaire
        const selectedType = document.getElementById("options").value;

        if (selectedType) {
            // console.log(`User selected: ${selectedType}`);
            await displayRandomPokemons(selectedType);  // Afficher un Pokémon au hasard du type sélectionné
        } else {
            console.log("No Pokémon type selected.");
        }
    });
});

const fetchPokemonByType = async (pokemonType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        const matchingPokemons = [];

        // Récupérer les infos du pokemon dans un array [name, types, photo]
        for (const pokemon of data) {
            if (pokemon.types.find((type) => type.name.toLowerCase() === pokemonType)) {// toLowerCase a virer lorsque la
                // liste déroulante sera intégrer.
                matchingPokemons.push({
                    name: pokemon.name.fr,
                    types: pokemon.types.map(type => type.name),
                    photo: pokemon.sprites.regular
                })
            }
        }

        return matchingPokemons;

    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        return []
    }
}

// Fonction pour mélanger le tableau (algorithme de Fisher-Yates)
function shuffle(array) {
    console.log("Shuffling Pokémon array...");
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    console.log("Array shuffled.");
    return array;
}

// Afficher les pokemons dans le DOM
const displayRandomPokemons = async (type) => {
    try {
        const allPokemons = await fetchPokemonByType(type);
        const randomPokemons = shuffle(allPokemons);
        const threeRandomPokemons = randomPokemons.slice(0, 3)

        threeRandomPokemons.forEach(pokemon => {
            // Intéraction avec le DOM
            let detailsPokemon = document.createElement('div');

            detailsPokemon.classList.add('pokemon');
            detailsPokemon.innerText = pokemon.name;
            detailsPokemon.pokemonData = pokemon;

            document.querySelector('#arc-astro-type').appendChild(detailsPokemon);
        });

        // Récupérer les élèments
        const pokemonElements = document.querySelectorAll('.pokemon');

        // Cliquer sur les pokemons
        pokemonElements.forEach(pokemon => {
            pokemon.addEventListener('click', (e) => {
                const target = e.target;
                const pokemonData = target.pokemonData // Récuperer les infos des pokemons

                // Masquer les pokemons
                pokemonElements.forEach(p => p.style.display = 'none');

                const astralDescription = astralChartCorrespondence(pokemonData);

                displayDetailsOfOnePokemon(pokemonData, astralDescription);
            });
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Gère la correspondance avec le thème astral
const astralChartCorrespondence = (data) => {
    // Récupérer les thèmes
    const themeAstro = pokemonAstrologyThemes;

    let themeDescription = "";

    data.types.forEach(type => {
        if (themeAstro[type]) {
            const randomTheme = themeAstro[type][Math.floor(Math.random() * themeAstro[type].length)];
            // console.log(randomTheme);
            themeDescription += `<p><strong>${randomTheme.theme}</strong> : ${randomTheme.description}`;
        }
    })

    return themeDescription;
}

// Gère l'affichage des détails du pokémon choisi
const displayDetailsOfOnePokemon = (data, description) => {
    let descriptionPokemon = document.createElement('div');

    descriptionPokemon.classList.add('description');
    descriptionPokemon.innerHTML = `
        <h2>${data.name}</h2>
        <p>Types: ${data.types.join(', ')}</p>
        <img src="${data.photo}" alt="${data.name}">
        <p><strong>Description</strong>: ${description}</p>
    `;

    document.querySelector('#arc-astro-description').appendChild(descriptionPokemon)
}

// displayRandomPokemons('feu');

// searchbar
const searchTerm = document.getElementById('search');

// Rechercher des pokemons dans la searchbar
document.getElementById('searchButton').addEventListener('click', () => {
    const input = searchTerm.value.toLowerCase();
    searchPokemon(input);
});

// Recuperer tous les pokemons
const searchPokemon = async (input) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1');
        const data = await response.json();

        // Filtrer les pokemons par noms
        const filteredPokemons = data.filter(pokemon => pokemon.name.fr.toLowerCase().includes(input));
        displaySearchResults(filteredPokemons);
    } catch (error) {
        console.error('Erreur lors de la recupération des données', error);
    }
}

const displaySearchResults = (pokemons) => {
    const description = pokemonAstrologyThemes;
    const resultsContainer = document.querySelector('.pokemonResults');
    resultsContainer.innerHTML = '';

    // Vérifier qu'on récupère bien un pokemon
    if (!pokemons || !pokemons.length) {
        resultsContainer.innerHTML = `<p>Aucun Pokémon trouvé</p>`;
        return;
    }

    // Correspondre les pokémons avec les thèmes
    pokemons.forEach(pokemon => {

        let types = pokemon.types.map(type => type.name); // Récupérer les types de pokemon par nom
        let themesForType = [];

        // Attribuer une description en fonction du type de pokemon rechercher
        types.forEach(type => {
            if (description[type]) {
                let randomTheme = description[type][Math.floor(Math.random() * description[type].length)];
                themesForType.push(`<p><strong>${randomTheme.theme}</strong>: ${randomTheme.description}</p>`);
            } else {
                themesForType.push(`<p><strong>${type}</strong> : Aucune description trouvée.</p>`);
            }

            // Intéraction avec le DOM
            let div = document.createElement('div');
            div.classList.add('pokemon');
            div.innerHTML = `
            <h2>${pokemon.name.fr}</h2>
            <p>Types: ${pokemon.types.map(type => type.name).join(', ')}</p>
            <img src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}">
            <h3>Description: </h3>${themesForType.join('')}
            `;
            resultsContainer.appendChild(div);
        });
    })
}

