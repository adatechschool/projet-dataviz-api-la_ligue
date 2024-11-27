const fetchPokemonData = async (userType) => {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')
        const data = await response.json();

        for(const pokemon of data) {
            if (pokemon.types.find((type) => {
                return type.name.toLowerCase() === userType
            }))
            console.log('POKEMON:', pokemon.name.fr)
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        return []
    }
}
