let score = 0;
let level = 1;
let pause = 0;

let ps;

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
    ps = pixelSize;
    const direction = directions[0];

    if(direction){
        if(direction === playerDirections.right) {x += speed;}
        if(direction === playerDirections.left){x-= speed;}
        if(direction === playerDirections.down){y += speed;}
        if(direction === playerDirections.up){y -= speed;}
        player.setAttribute("facing", direction);
    }

    player.setAttribute("walking", direction ? "true" : "false");

    let lLimit = 0;
    let rLimit = 200 - 32;
    let tLimit = 0;
    let bLimit = 200 - 32;

    if (x < lLimit) {x = lLimit;}
    if (x > rLimit) {x = rLimit;}
    if (y < tLimit) {y = tLimit;}
    if (y > bLimit) {y = bLimit;}

    player.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
}

function createBox(x,y){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","box");
    box.setAttribute("id","box");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x*ps}px, ${y*ps}px, 0 )`;

}
/*
function collisionDet(ply,bx ){
let obj1 = ply.getBoundingClientRect();
let obj2 = bx.getBoundingClientRect();

}
*/

function init(){
    let up = document.getElementById("upArrow");
    let right = document.getElementById("rightArrow");
    let left = document.getElementById("leftArrow");
    let down = document.getElementById("downArrow");

    step();

    createBox(16,16);

    createBox(100,100);

    
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