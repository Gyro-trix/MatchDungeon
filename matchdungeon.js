let score = 0;
let level = 1;
let pause = 0;

let player = document.querySelector(".player");
let map = document.querySelector(".map");

let x = 100;
let y = 50;
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

    player.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
}

function init(){
    let up = document.getElementById("upArrow");
    let right = document.getElementById("rightArrow");
    let left = document.getElementById("leftArrow");
    let down = document.getElementById("downArrow");

    step();
    /*up.addEventListener("click", );
    right.addEventListener("click", );
    left.addEventListener("click", );
    down.addEventListener("click", );
    */
}

const step = () => {
    placePlayer();
    window.requestAnimationFrame(() => {
       step();
    })
 }

document.addEventListener("keydown", (e) =>{
    let dir = keys[e.key];
    /*console.log(e.key);
    console.log(keys[e.key]);
    console.log(dir);
    console.log(directions.indexOf(dir));*/
    if (dir && directions.indexOf(dir) === -1) {
        directions.unshift(dir)
    }
})

document.addEventListener("keyup", (e) => {
    let dir = keys[e.key];
    let index = directions.indexOf(dir);
    if (index > -1){
        directions.splice(index, 1)
    }
})

window.addEventListener("DOMContentLoaded", init());