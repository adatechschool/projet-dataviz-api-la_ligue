function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    console.log(hour);
    let min = now.getMinutes();

    let displayHour = (hour < 10 ? "0" : "") + hour;
    let displayMin = (min < 10 ? "0" : "") + min;

    const displayElement = document.querySelector("#display-hour");
    // console.log(displayHour);
    displayElement.innerText = `${displayHour}h${displayMin}`;

    // Vérification si on est entre 18h et 6h du matin
    // Ici pour un mode automatique :
    if (hour >= 18 || hour < 6) {
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