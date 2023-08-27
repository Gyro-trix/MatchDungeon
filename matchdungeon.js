let score = 0;
let level = 1;
let pause = 0;

let player = document.querySelector(".player");
let map = document.querySelector(".map");

let x = 90;
let y = 34;
let directions = [];
let speed = 1;

const playerDirections = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
}

const keys = {
    ArrowUp: playerDirections.up,
    ArrowLeft: playerDirections.left,
    ArrowRight: playerDirections.right,
    ArrowDown: playerDirections.down,
}

const placePlayer = () =>{

    let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));

    const direction = directions[0];

    if(direction){
        if(direction === playerDirections.right) {x += speed;}
        if(direction === playerDirections.left){x-= speed;}
        if(direction === playerDirections.down){y += speed;}
        if(direction === playerDirections.up){y -= speed;}
        player.setAttribute("facing", direction);
    }

    player.setAttribute("walking", direction ? "true" : "false");

}

function init(){
    let up = document.getElementById("upArrow");
    let right = document.getElementById("rightArrow");
    let left = document.getElementById("leftArrow");
    let down = document.getElementById("downArrow");

    /*up.addEventListener("click", );
    right.addEventListener("click", );
    left.addEventListener("click", );
    down.addEventListener("click", );
    */
}

document.addEventListener("keydown", (e) =>{
let dir = keys[e.key];
console.log(e.key);
console.log(keys[e.key]);
if (dir && directions.indexOf(dir) === -1) {directions.unshift(dir)}
})

window.addEventListener("DOMContentLoaded", init());