export function initSearchbar(searchTerm, pokemonAstrologyThemes) {

// Rechercher des pokemons dans la searchbar
    document.getElementById('searchButton').addEventListener('click', () =>{
        const input = searchTerm.value.toLowerCase();
        searchPokemon(input)
    })

// Recuperer tous les pokemons
    const searchPokemon = async (input) => {
        try {
            const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1');
            const data = await response.json();

            // Filtrer les pokemons par noms
            const filteredPokemons = data.filter(pokemon => pokemon.name.fr.toLowerCase().includes(input));
            displaySearchResults(filteredPokemons)
        } catch(error){
            console.error('Erreur lors de la recupération des données', error)
        }
    };

    const displaySearchResults = pokemons => {
        const description = pokemonAstrologyThemes
        const resultsContainer = document.querySelector('.pokemonResults');
        resultsContainer.innerHTML = '';

        // Vérifier qu'on récupère bien un pokemon
        if(!pokemons || !pokemons.length){
            resultsContainer.innerHTML = `<p>Aucun Pokémon trouvé</p>`;
            return;
        }

        // Correspondre les pokémons avec les thèmes
        pokemons.forEach(pokemon => {

            let types = pokemon.types.map(type => type.name); // Récupérer les types de pokemon par nom
            let themesForType = [];

            // Attribuer une description en fonction du type de pokemon rechercher
            types.forEach(type => {
                if(description[type]) {
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
            })
        })

    }
}