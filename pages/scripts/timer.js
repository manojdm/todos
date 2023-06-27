const timer = document.querySelector('.timer');
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');

//Pomodoro
const pmaxMinutes = 24;

//break
const bmaxMinutes = 4;

const minMinutes = 0;
const minSeconds = 0;

//time left
let minLeft = 24;
let secLeft = 0;

//Total consumptions
let pconsumed = 0;
let bconsumed = 0;

let current = 'pomodoro'

//Timer function
const timerFunction = () => {
    if(current == 'pomodoro'){
        if(secLeft == 0){
            secLeft = 59
            minLeft -= 1
            if(minLeft == 0){
                pconsumed += 1;
                minLeft = bmaxMinutes;
                current = 'break'
            }
            minutes.innerHTML = minLeft.toString().padStart(2, '0')

        } else {
            secLeft -=1
        }

        seconds.innerHTML=secLeft.toString().padStart(2, '0');

    } else {
        
        if(secLeft == 0){
            secLeft = 59
            minLeft -= 1
            if(minLeft == 0){
                bconsumed += 1
                minLeft = pmaxMinutes;
                current = 'pomodoro'
            }
            minutes.innerHTML = minLeft.toString().padStart(2, '0')

        } else {
            secLeft -=1
        }

        seconds.innerHTML=secLeft.toString().padStart(2, '0');
    } 

}

export default timerFunction

// window.addEventListener('load', () => {
//     const interval = setInterval(timerFunction, 1000);
// });
