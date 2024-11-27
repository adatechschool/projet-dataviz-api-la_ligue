const fetchPokemonData = async (pkmnType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        const matchingPokemons = [];

        for(const pokemon of data) {
            if (pokemon.types.find((type) => {
                return type.name.toLowerCase() === pkmnType
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

const getRandomPokemons = (pokemons, count) => {
    const shuffled = pokemons.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
}


const displayRandomPkmn = async (type) => {
    const allPokemons = await fetchPokemonData(type);
    const randomPokemons = getRandomPokemons(allPokemons, 3)
    return randomPokemons
}

console.log(displayRandomPkmn('feu'))