// Intéraction avec le DOM
const displayElement = document.querySelector("#display-hour");
// console.log(displayHour);

// Ici on affiche l'heure du navigateur 
function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    // console.log(hour);
    let min = now.getMinutes();

    let displayHour = (hour < 10 ? "0" : "") + hour;
    let displayMin = (min < 10 ? "0" : "") + min;

    displayElement.innerText = `${displayHour}h${displayMin}`;

    darkMode(hour);

};

// Gestion du dark mode
const darkMode = (navHour) => {

     // Vérification si on est entre 18h et 6h du matin
    // Ici pour un mode automatique :
    if (navHour >= 18 || navHour < 6) {
        // Mode nuit
        displayElement.style.color = "white";
        document.body.style.background = "black";
    } else {
        // Mode jour
        displayElement.style.color = "black";
        document.body.style.background = "white";
    };
};

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

// récupérer les types de pokemon
const fetchAllTypes = async () => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/types');
        const data = await response.json();
  
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

        for(const pokemon of data) {
            if (pokemon.types.find((type) => {
                return type.name.toLowerCase() === pkmnType // toLowerCase a virer lorsque la liste déroulante sera intégrer.
            }))
            matchingPokemons.push(pokemon.name.fr)
            //console.log('POKEMON:', pokemon.name.fr)
        };

        return matchingPokemons;

    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        return []
    };
};

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
const displayRandomPkmn = async (type) => {
    const allPokemons = await fetchPokemonByType(type);
    const randomPokemons = shuffle(allPokemons);
    const threeRandomPokemons = randomPokemons.slice(0, 3)

    // Interaction dans le DOM
    let p = document.createElement('p');
    p.innerText = threeRandomPokemons;
    document.querySelector('body').appendChild(p)

    //return randomPokemons
}
displayRandomPkmn('feu')