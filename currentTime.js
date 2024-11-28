// Affichage dans le DOM
const displayElement = document.querySelector("#display-hour");
// console.log(displayHour);

// On affiche l'heure du navigateur :
function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    console.log(hour);
    let min = now.getMinutes();

    let displayHour = (hour < 10 ? "0" : "") + hour;
    let displayMin = (min < 10 ? "0" : "") + min;

    displayElement.innerText = `${displayHour}h${displayMin}`;

    darkMode(hour);
}

// Gestion du darkmode :
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
    }
}

setCurrentTime();
setInterval(setCurrentTime, 2000);