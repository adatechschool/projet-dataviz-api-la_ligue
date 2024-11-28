async function pokemonAPI() {
    const response = await fetch("https://tyradex.app/api/v1/pokemon");
    const pokemons = await response.json();
    // console.log(response);
    // console.log(pokemons);

    const detailsPokemon = pokemons[1];
    console.log("Fiche du pokémon: ", detailsPokemon);
    const namePokemon = detailsPokemon.name.fr;
    console.log("Nom du pokémon: ", namePokemon);
    const typesPokemon = detailsPokemon.types;
    console.log("Types du pokémon: ", typesPokemon);
    const typeIndex0Pokemon = detailsPokemon.types[0];
    console.log("Types du pokémon à l'index 0: ", typeIndex0Pokemon);
    const imgTypesPokemon = typesPokemon.image;
    console.log("Image du type: ", imgTypesPokemon);
    const imgPokemon = detailsPokemon.sprites.regular;
    console.log("Image du pokémon version regular: ", imgPokemon);

    const displayElement = document.querySelector("#display-hour");
    const divImage = document.createElement("img");
    divImage.src = imgPokemon;
    displayElement.appendChild(divImage);
}

// Afficher les pokémons par le type
async function displayPokemonsByType(type) {
    const resp = await fetch("https://tyradex.vercel.app/api/v1/gen/1");
    const pokemonsGen1 = await resp.json(); // Ici mon tableau dans lequel je vais filtrer par le type ne paramètre
    // console.log(resp);
    // console.log(pokemonsGen1);

    const filteredPokemons = pokemonsGen1.filter(pokemon => {
        return pokemon.types.find(itemType => itemType.name === type); // Ici type = "Eau"
    });

    // console.log(`Pokémons de type ${type} :`);
    // filteredPokemons.forEach(pokemon => {
    //     console.log(`${pokemon.name.fr}`);
    // });

    return filteredPokemons;
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

async function displayThreeRandomPokemons(type) {

    const filteredPokemons = await displayPokemonsByType(type);
    // console.log(filteredPokemons);
    const shuffledPokemons = shuffle(filteredPokemons);
    // console.log(shuffledPokemons);

    // Récupérer que 3 pokémons
    const threeRandomPokemons = shuffledPokemons.slice(0, 3);
    console.log(threeRandomPokemons);

    console.log(`3 Pokémons de type ${type} :`);
    for (const pokemon of threeRandomPokemons) {
        console.log(`${pokemon.name.fr}`);

        const paraph = document.createElement('p');
        paraph.innerText = `${pokemon.name.fr}`;
        const displayElement = document.querySelector("#display-hour");
        displayElement.appendChild(paraph);
    }
}

let choiceType = "Eau"
// displayPokemonsByType(choiceType);
displayThreeRandomPokemons(choiceType)