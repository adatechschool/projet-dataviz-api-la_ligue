function setCurrentTime() {
    let now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();

    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;

    const displayHour = document.querySelector("#display-hour");
    // console.log(displayHour);
    displayHour.innerText = `${hour}h${min}`;
}

setCurrentTime();

setInterval(setCurrentTime, 1000);