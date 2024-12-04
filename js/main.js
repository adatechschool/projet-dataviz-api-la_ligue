import { initTimeDisplay } from './timeDisplay.js';
import { initThemeManager } from './darkmodeManager.js';
import { initLogoManager } from './logoManager.js';
import { createPokemonAstrologyService } from "./pokemonAstral.js";
import { initSearchbar } from "./searchbarService.js";
// Liaison à notre fichier avec les thème astrales
import { pokemonAstrologyThemes } from './theme.js';

// Récupération des éléments du DOM
const displayElement = document.querySelector("#display-hour");
const themeSwitch = document.querySelector('.theme-switch');
const imgLogo = document.querySelector('#logo-title');
const searchTerm = document.getElementById('search');
const dropdown = document.querySelector('.select-types');

// Initialisation des services
const setCurrentTime = initTimeDisplay(displayElement);
const { darkmodeTime } = initThemeManager(themeSwitch);
initLogoManager(imgLogo);

// Mise à jour du thème selon l'heure
setInterval(setCurrentTime, 3000);

// Initialisation du service
const pokemonAstrologyService = createPokemonAstrologyService(pokemonAstrologyThemes);

// Initialisation de la searchbar
const searchbarService = initSearchbar(searchTerm, pokemonAstrologyThemes);

// Démarrage de l'application
pokemonAstrologyService.displayRandomPokemons('eau'); // doit prendre une variable qui récupère le type choisi