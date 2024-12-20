import { initTimeDisplay } from './timeDisplay.js';
import { initThemeManager } from './darkmodeManager.js';
import { initLogoManager } from './logoManager.js';
import { createPokemonAstrologyService } from "./pokemonAstral.js";
import { initSearchbar } from "./searchbarService.js";
import { initDropdown } from "./dropdownService.js";
// Liaison à notre fichier avec les thème astrales
import { pokemonAstrologyThemes } from './theme.js';

// Récupération des éléments du DOM
const displayElement = document.querySelector("#display-hour");
const themeSwitch = document.querySelector('.theme-switch');
const imgLogo = document.querySelector('#logo-title');
const searchTerm = document.getElementById('search-button');


// Initialisation des services
const setCurrentTime = initTimeDisplay(displayElement);
const { darkmodeTime } = initThemeManager(themeSwitch);
initLogoManager(imgLogo);

// Mise à jour du thème selon l'heure
setInterval(setCurrentTime, 3000);

// Initialisation du service Pokémon
const pokemonAstrologyService = createPokemonAstrologyService(pokemonAstrologyThemes);

// Initialisation du service Dropdown
const dropdownService = initDropdown(pokemonAstrologyService.displayRandomPokemons);

// Initialisation de la searchbar
const searchbarService = initSearchbar(searchTerm, pokemonAstrologyThemes);