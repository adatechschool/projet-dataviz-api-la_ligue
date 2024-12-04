import { pokemonAstrologyThemes } from "./theme.js";

// Intéraction avec le DOM
const displayElement = document.querySelector("#display-hour");
const themeSwitch = document.querySelector('.theme-switch');

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

setCurrentTime();
setInterval(setCurrentTime, 2000);

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

const fetchPokemonByType = async (pkmnType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        const matchingPokemons = [];

        for(const pokemon of data) {
            if (pokemon.types.find((type) => type.name.toLowerCase() === pkmnType)){// toLowerCase a virer lorsque la liste déroulante sera intégrer.
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

        // Interaction dans le DOM
        /*
        let p = document.createElement('p');
        p.innerText = threeRandomPokemons;
        document.querySelector('body').appendChild(p);
        */

        threeRandomPokemons.forEach(pokemon => {
            let detailsPokemon = document.createElement('div');
            detailsPokemon.classList.add('pokemon');
            detailsPokemon.innerText = pokemon.name;
            detailsPokemon.pokemonData = pokemon;
            document.querySelector('#arc-astro-type').appendChild(detailsPokemon);
            });

            // Récupérer les élèments
            const pokemonElements = document.querySelectorAll('.pokemon');

            // Récupérer les thèmes
            const themeAstro = pokemonAstrologyThemes;

            // Cliquer sur les pokemons
            pokemonElements.forEach(pokemon => {
                pokemon.addEventListener('click', (e) => {
                const target = e.target;
                const pokemonData = target.pokemonData // Récuperer les infos des pokemons

                // Masquer les pokemons
                pokemonElements.forEach(p => p.style.display = 'none');

                // Correspondre les pokémons avec les thèmes
                let themeDescription = "";
                pokemonData.types.forEach(type => {
                    if(themeAstro[type]){
                        const randomTheme = themeAstro[type][Math.floor(Math.random() * themeAstro[type].length)];
                        console.log(randomTheme)
                        themeDescription += `<p><strong>${randomTheme.theme}</strong> : ${randomTheme.description}`
                    }
                })

                // Créer et afficher les détails du Pokemon cliqué
                let descriptionPokemon = document.createElement('div');
                    descriptionPokemon.classList.add('description')
                    descriptionPokemon.innerHTML = `
                        <h2>${pokemonData.name}</h2>
                        <p>Types: ${pokemonData.types.join(', ')}</p>
                        <img src="${pokemonData.photo}" alt="${pokemonData.name}">
                        <p><strong>Description</strong>: ${themeDescription}</p>
                    `
                document.querySelector('#arc-astro-description').appendChild(descriptionPokemon);

            })
        })
    } catch(error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
};

displayRandomPokemons ('feu');

// searchbar
const searchTerm = document.getElementById('search');

// Rechercher des pokemons dans la searchbar
document.getElementById('searchButton').addEventListener('click', () =>{
    const input = searchTerm.value.toLowerCase();
    console.log('input:', input)
    searchPokemon(input)
})

// Recuperer tous les pokemons 
const searchPokemon = async (input) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1');
        const data = await response.json();

        // Filtrer les pokemons 
        const filteredPokemons = data.filter(pokemon => pokemon.name.fr.toLowerCase().includes(input));
        console.log(filteredPokemons)
        displaySearchResults(filteredPokemons)
    } catch(error){
        console.error('Erreur lors de la recupération des données', error)
    }
};

const displaySearchResults = pokemons => {
    const description = pokemonAstrologyThemes
    console.log('description', description)
    const resultsContainer = document.querySelector('.pokemonResults');
    resultsContainer.innerHTML = '';

    // Correspondre les pokémons avec les thèmes
    pokemons.forEach(pokemon => {
        console.log('pokemon', pokemon);
        
        let types = pokemon.types.map(type => type.name);
        let themesForType = [];

        console.log('types', types)

        types.forEach(type => {
            console.log(`Checking type: ${type}`)
            if(description[type]) { 
                let randomTheme = description[type][Math.floor(Math.random() * description[type].length)]; 
                console.log('randomTheme', randomTheme); 
                themesForType.push(`<p><strong>${randomTheme.theme}</strong>: ${randomTheme.description}</p>`); 
            }
        })

        console.log('themesForType', themesForType);

        let div = document.createElement('div');
        div.classList.add('pokemon');
        div.innerHTML = `
        <h2>${pokemon.name.fr}</h2>
        <p>Types: ${pokemon.types.map(type => type.name).join(', ')}</p>
        <img src="${pokemon.sprites.regular}" alt="${pokemon.name.fr}">
        <h3>Description: </h3>${themesForType.join('')}
        `;
        resultsContainer.appendChild(div);

    })
}