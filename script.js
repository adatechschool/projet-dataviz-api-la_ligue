// // Intéraction avec le DOM
// const displayElement = document.querySelector("#display-hour");
// // console.log(displayHour);

// // Ici on affiche l'heure du navigateur 
// function setCurrentTime() {
//     let now = new Date();
//     let hour = now.getHours();
//     // console.log(hour);
//     let min = now.getMinutes();

//     let displayHour = (hour < 10 ? "0" : "") + hour;
//     let displayMin = (min < 10 ? "0" : "") + min;

//     displayElement.innerText = `${displayHour}h${displayMin}`;


//     darkMode(hour);

// };

// // Gestion du dark mode
// const darkMode = (navHour) => {

//      // Vérification si on est entre 18h et 6h du matin
//     // Ici pour un mode automatique :
//     if (navHour >= 18 || navHour < 6) {
//         // Mode nuit
//         displayElement.style.color = "white";
//         document.body.style.background = "black";
//     } else {
//         // Mode jour
//         displayElement.style.color = "black";
//         document.body.style.background = "white";
//     };
// };

// setCurrentTime();
// setInterval(setCurrentTime, 2000);


// const fetchPokemonByType = async (pkmnType) => {
//     try {
//         const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
//         const data = await response.json();

//         const matchingPokemons = [];

//         for(const pokemon of data) {
//             if (pokemon.types.find((type) => {
//                 return type.name.toLowerCase() === pkmnType // toLowerCase a virer lorsque la liste déroulante sera intégrer.
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

 fetchPokemonByType('plante');

Fonction pour mélanger le tableau (algorithme de Fisher-Yates)
 function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        // Échanger les éléments array[i] et array[j]
        [array[i], array[j]] = [array[j], array[i]];
     }

     return array;
}

 Afficher les pokemons dans le DOM 
const displayRandomPkmn = async (type) => {
   const allPokemons = await fetchPokemonByType(type);
    const randomPokemons = shuffle(allPokemons);
    const threeRandomPokemons = randomPokemons.slice(
 Interaction dans le DOM
    let p = document.createElement('p');
     p.innerText = threeRandomPokemons;
    document.querySelector('body').appendChild(p)

    return randomPokemons
 }
 displayRandomPkmn('feu')







async function PokemonImage() {
    const apiUrl  = await fetch( 'https://tyradex.vercel.app/api/v1/gen/1');
    const reponse = await apiUrl.json()
    console.log(reponse)
    const pokemons = await response.json(); // Récupère tous les pokémons

    const detailsPokemon = pokemons[10];
    console.log("Fiche du pokémon: ", detailsPokemon);

    
 
} ; 

PokemonImage()
const Ectoplasma  = {
    nom: "Ectoplasma",
    numero: 93,
    types: ["SpectrePoison"],
    taille: "1,5 m",
    poids: "40,5 kg",
    talent: "Corps Maudit",
    sexe: "50% ♂, 50% ♀",
    nature: "Ombre",

    statistiques: {
        pv: 60,
        attaque: 65,
        defense: 60,
        attaqueSpeciale: 130,
        defenseSpeciale: 70,
        vitesse: 110
    }};
    attaques:{ [
        "Châtiment",
        "Poing Ombre",
        "Gaz Toxik",
        "Malédiction",
        "Ball'Ombre"
    ],
    evolution: "Méga-Ectoplasma ( Pierre  Ectoplasmite pour Méga-Ecplasma)",
    description: "Ectoplasma est un Pokémon très malicieux et parfois méchant. Il s'amuse à faire des blagues et à lancer des malédictions, comme faire semblant d'être l'ombre de quelqu'un avant de se comporter de manière erratique. Quand sa proie le remarque, Ectoplasma se nourrit de la terreur de la victime".
};
function afficherCaracteristiques(pokemon) {
    console.log("Nom : " + pokemon.nom);
    console.log("Numéro : #" + pokemon.numero);
    console.log("Type(s) : " + pokemon.types.join(", "));
    console.log("Taille : " + pokemon.taille);
    console.log("Poids : " + pokemon.poids);
    console.log("Talent : " + pokemon.talent);
    console.log("Sexe : " + pokemon.sexe);
    console.log("Nature : " + pokemon.nature);

    console.log("\nStatistiques de base :");
    console.log("PV : " + pokemon.statistiques.pv);
    console.log("Attaque : " + pokemon.statistiques.attaque);
    console.log("Défense : " + pokemon.statistiques.defense);
    console.log("Attaque Spéciale : " + pokemon.statistiques.attaqueSpeciale);
    console.log("Défense Spéciale : " + pokemon.statistiques.defenseSpeciale);
    console.log("Vitesse : " + pokemon.statistiques.vitesse);

    console.log("\nAttaques apprises :");
    console.log(pokemon.attaques.join(", "));

    console.log("\nÉvolution : " + pokemon.evolution);
    console.log("\nDescription Pokédex : " + pokemon.description);
}
afficherCaracteristiques(Ectoplasma);