export function createPokemonAstrologyService(pokemonAstrologyThemes) {    const fetchPokemonByType = async (pokemonType) => {        try {            const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1')            const data = await response.json();            const matchingPokemons = [];            for(const pokemon of data) {                if (pokemon.types.find((type) => type.name.toLowerCase() === pokemonType)){// toLowerCase a virer lorsque                    // la liste déroulante sera intégrer.                    matchingPokemons.push({                        name: pokemon.name.fr,                        types: pokemon.types.map(type => type.name),                        photo: pokemon.sprites.regular                    })                }            }            return matchingPokemons;        } catch (error) {            console.error('Erreur lors de la récupération des données:', error)            return []        }    }// Fonction pour mélanger le tableau (algorithme de Fisher-Yates)    function shuffle(array) {        for (let i = array.length - 1; i > 0; i--) {            let j = Math.floor(Math.random() * (i + 1));            // Échanger les éléments array[i] et array[j]            [array[i], array[j]] = [array[j], array[i]];        }        return array;    }// Afficher les pokemons dans le DOM    const displayRandomPokemons = async (type) => {        try {            const allPokemons = await fetchPokemonByType(type);            const randomPokemons = shuffle(allPokemons);            const threeRandomPokemons = randomPokemons.slice(0, 3)            threeRandomPokemons.forEach(pokemon => {                let detailsPokemon = document.createElement('div');                detailsPokemon.classList.add('pokemon');                detailsPokemon.innerText = pokemon.name;                detailsPokemon.pokemonData = pokemon;                document.querySelector('#buttons-pokemon').appendChild(detailsPokemon);            });            // Récupérer les élèments            const pokemonElements = document.querySelectorAll('.pokemon');            // Cliquer sur les pokemons            pokemonElements.forEach(pokemon => {                pokemon.addEventListener('click', (e) => {                    const target = e.target;                    const pokemonData = target.pokemonData // Récuperer les infos des pokemons                    // Masquer les pokemons                    pokemonElements.forEach(p => p.style.display = 'none');                    const astralDescription = astralChartCorrespondence(pokemonData);                    displayDetailsOfOnePokemon(pokemonData, astralDescription);                })            })        } catch(error) {            console.error('Erreur lors de la récupération des données:', error);        }    };// Gère la correspondance avec le thème astral    const astralChartCorrespondence = (data) => {        // Récupérer les thèmes        const themeAstro = pokemonAstrologyThemes;        let themeDescription = "";        data.types.forEach(type => {            if(themeAstro[type]){                const randomTheme = themeAstro[type][Math.floor(Math.random() * themeAstro[type].length)];                // console.log(randomTheme);                themeDescription += `<p><strong>${randomTheme.theme}</strong> : ${randomTheme.description}`;            }        })        return themeDescription;    }// Gère l'affichage des détails du pokémon choisi    const displayDetailsOfOnePokemon = (data, description) => {        let descriptionPokemon = document.createElement('div');        descriptionPokemon.classList.add('description');        descriptionPokemon.innerHTML = `        <h1 id="pokemon-name">${data.name}</h1>        <p>Types: ${data.types.join(', ')}</p>        <div class="img-container">            <img src="${data.photo}" alt="${data.name}" id="img-pokemon">        </div>        <p><strong>Description</strong>: ${description}</p>    `;        document.querySelector('#arc-astro-description').appendChild(descriptionPokemon)    }    return {        fetchPokemonByType,        displayRandomPokemons,        astralChartCorrespondence,        displayDetailsOfOnePokemon,    }}