

const displayHours = () => {
    let getDate = new Date();

    let getHour = getDate.getHours();
    let getMinutes = getDate.getMinutes();
    //let getSeconds = getDate.getSeconds();

    getHour = (getHour < 10 ? "0" : "") + getHour;
    getMinutes = (getMinutes < 10 ? "0" : "") + getMinutes;

    let time = getHour + ":" + getMinutes;

    let h1 = document.getElementById('time-display');
    if(!h1){
        let h1 = document.createElement('h1');
        h1.id = 'time-display';
        document.querySelector('body').appendChild(h1);
    }
    h1.innerHTML = time

}

const affiche = setInterval(displayHours, '1000')





