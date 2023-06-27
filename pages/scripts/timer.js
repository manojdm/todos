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

export default timerFunction

// window.addEventListener('load', () => {
//     const interval = setInterval(timerFunction, 1000);
// });
