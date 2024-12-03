import { pokemonAstrologyThemes } from "./js/theme.js";

// Intéraction avec le DOM
const displayElement = document.querySelector("#display-hour");
const themeSwitch = document.querySelector('.theme-switch');
const imgLogo = document.querySelector('#logo-title');

// --- Ici on affiche l'heure du navigateur ---
function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    // console.log(hour);
    let min = now.getMinutes();

    let displayHour = (hour < 10 ? "0" : "") + hour;
    let displayMin = (min < 10 ? "0" : "") + min;

    displayElement.innerText = `${displayHour}h${displayMin}`;

    // Appelle le darkmode
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
    // console.log(themeStatus);

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

// récupérer les types
const fetchAllTypes = async () => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/types');
        const data = await response.json();

        // Retourner seulement les noms en français
        return data.map(type => type.name.fr);
    } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
        return [];
    }
}

const fetchPokemonByType = async (pokemonType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        const matchingPokemons = [];

        for(const pokemon of data) {
            if (pokemon.types.find((type) => type.name.toLowerCase() === pokemonType)){// toLowerCase a virer lorsque la
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
        console.error('Erreur lors de la récupération des données:', error)
        return []
    }
}

// Fonction pour mélanger le tableau (algorithme de Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        // Échanger les éléments array[i] et array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

// Afficher les pokemons dans le DOM
const displayRandomPokemons = async (type) => {
    try {
        const allPokemons = await fetchPokemonByType(type);
        const randomPokemons = shuffle(allPokemons);
        const threeRandomPokemons = randomPokemons.slice(0, 3)

        threeRandomPokemons.forEach(pokemon => {
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
                })
            })
    } catch(error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
};

// Gère la correspondance avec le thème astral
const astralChartCorrespondence = (data) => {
    // Récupérer les thèmes
    const themeAstro = pokemonAstrologyThemes;

    let themeDescription = "";

    data.types.forEach(type => {
        if(themeAstro[type]){
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

displayRandomPokemons ('feu');