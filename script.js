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
    // Vérification si on est entre 18h et 6h du matin.
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
};


const fetchPokemonByType = async (pkmnType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        const matchingPokemons = [];

        for (const pokemon of data) {
            if (pokemon.types.find((type) => {
                return type.name.toLowerCase() === pkmnType
                // toLowerCase a virer lorsque la liste déroulante sera intégrer.
            }))
                matchingPokemons.push(pokemon.name.fr)
            //console.log('POKEMON:', pokemon.name.fr)
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
    const allPokemons = await fetchPokemonByType(type);
    const randomPokemons = shuffle(allPokemons);
    const threeRandomPokemons = randomPokemons.slice(0, 3)

    // Interaction dans le DOM
    let p = document.createElement('p');
    p.innerText = threeRandomPokemons;
    document.querySelector('#arc-astro-type').appendChild(p)

    //return randomPokemons
}

displayRandomPokemons("Feu");