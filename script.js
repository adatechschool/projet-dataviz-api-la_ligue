import { pokemonAstrologyThemes } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
    const displayElement = document.querySelector("#display-hour");
    const themeSwitch = document.querySelector('.theme-switch');
    const form = document.querySelector('form');  // Ajout de la sélection du formulaire

    // --- Ici on affiche l'heure du navigateur ---
    function setCurrentTime() {
        let now = new Date();
        let hour = now.getHours();
        let min = now.getMinutes();

        let displayHour = (hour < 10 ? "0" : "") + hour;
        let displayMin = (min < 10 ? "0" : "") + min;

        console.log(`Current time set to: ${displayHour}h${displayMin}`);
        displayElement.innerText = `${displayHour}h${displayMin}`;

        darkmodeTime(hour);
    }

    // --- Gestion du dark mode ---
    let isAutoDarkMode = true;
    let isDarkModeTime = false;

    const darkmodeTime = (navHour) => {
        if (navHour >= 18 || navHour < 6) {
            isDarkModeTime = true;
        } else {
            isDarkModeTime = false;
        }

        console.log(`Dark mode status set to: ${isDarkModeTime}`);
        if (isAutoDarkMode === true) {
            applyTheme(isDarkModeTime);
        }
    }

    function applyTheme(themeStatus) {
        console.log(`Applying theme: ${themeStatus ? 'dark' : 'light'}`);
        if (themeStatus) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            isAutoDarkMode = false;
            const currentTheme = document.documentElement.getAttribute('data-theme');
            console.log(`Theme switch clicked. Current theme: ${currentTheme}`);

            if (currentTheme === 'dark') {
                applyTheme(false);
            } else {
                applyTheme(true);
            }
        });
    }

    setCurrentTime();
    setInterval(setCurrentTime, 2000);

    const exPokemonTypes = async () => {
        try {
            console.log("Fetching selected Pokémon types...");
            const response = await fetch('https://tyradex.vercel.app/api/v1/types');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Types fetched successfully:", data);

            const selectedTypes = ['eau', 'plante', 'feu', 'spectre'];
            return data
                .map(type => type.name.fr)
                .filter(typeName => selectedTypes.includes(typeName.toLowerCase()));
        } catch (error) {
            console.error('Erreur lors de la récupération des types:', error);
            return [];
        }
    };

    const typesDropDown = async () => {
        const dropdown = document.getElementById("options");

        if (!dropdown) {
            console.error("Dropdown element not found in the DOM.");
            return;
        }

        dropdown.innerHTML = '';

        try {
            const types = await exPokemonTypes();
            types.forEach((type) => {
                const option = document.createElement("option");
                option.value = type.toLowerCase();
                option.textContent = type;
                dropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Erreur lors du remplissage de la liste déroulante :", error);
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Erreur de chargement";
            dropdown.appendChild(option);
        }
    };

    typesDropDown();

    // Fonction pour valider le choix de l'utilisateur
    form.addEventListener("submit", async (event) => {
        event.preventDefault();  // Empêche la soumission du formulaire
        const selectedType = document.getElementById("options").value;

        if (selectedType) {
            console.log(`User selected: ${selectedType}`);
            await displayRandomPkmn(selectedType);  // Afficher un Pokémon au hasard du type sélectionné
        } else {
            console.log("No Pokémon type selected.");
        }
    });

    const fetchPokemonByType = async (pkmnType) => {
        try {
            console.log(`Fetching Pokémon of type: ${pkmnType}`);
            const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Pokémon data fetched successfully:", data);

            const selectedTypes = ['eau', 'plante', 'feu', 'spectre'];
            if (!selectedTypes.includes(pkmnType.toLowerCase())) {
                console.error(`Type ${pkmnType} is not a valid selected type.`);
                return [];
            }

            const matchingPokemons = data.filter(pokemon =>
                pokemon.types.some(type => type.name.toLowerCase() === pkmnType)
            ).map(pokemon => ({
                name: pokemon.name.fr,
                types: pokemon.types.map(type => type.name),
                photo: pokemon.sprites.regular
            }));

            console.log(`Matching Pokémon found:`, matchingPokemons);
            return matchingPokemons;
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            return [];
        }
    };

    function shuffle(array) {
        console.log("Shuffling Pokémon array...");
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        console.log("Array shuffled.");
        return array;
    }

    const displayRandomPkmn = async (type) => {
        try {
            console.log(`Displaying Pokémon of type: ${type}`);
            const allPokemons = await fetchPokemonByType(type);
            const randomPokemons = shuffle(allPokemons);
            const threeRandomPokemons = randomPokemons.slice(0, 3);

            threeRandomPokemons.forEach(pokemon => {
                let div = document.createElement('div');
                div.classList.add('pokemon');
                div.innerText = pokemon.name;
                div.pokemonData = pokemon;
                document.querySelector('body').appendChild(div);
                console.log(`Displayed Pokémon: ${pokemon.name}`);
            });

            const pokemonElements = document.querySelectorAll('.pokemon');
            pokemonElements.forEach(pokemon => {
                pokemon.addEventListener('click', (e) => {
                    const target = e.target;
                    const pokemonData = target.pokemonData;
                    console.log(`Pokemon clicked: ${pokemonData.name}`);

                    pokemonElements.forEach(p => p.style.display = 'none');

                    let themeDescription = "";
                    pokemonData.types.forEach(type => {
                        if (pokemonAstrologyThemes[type]) {
                            const randomTheme = pokemonAstrologyThemes[type][Math.floor(Math.random() * pokemonAstrologyThemes[type].length)];
                            themeDescription += `<p><strong>${randomTheme.theme}</strong> : ${randomTheme.description}</p>`;
                        }
                    });

                    let div = document.createElement('div');
                    div.classList.add('description');
                    div.innerHTML = `
                        <h2>${pokemonData.name}</h2>
                        <p>Types: ${pokemonData.types.join(', ')}</p>
                        <img src="${pokemonData.photo}" alt="${pokemonData.name}">
                        <p><strong>Description</strong>: ${themeDescription}</p>
                    `;
                    document.querySelector('body').appendChild(div);
                    console.log(`Displayed Pokémon details for: ${pokemonData.name}`);
                });
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };
});
