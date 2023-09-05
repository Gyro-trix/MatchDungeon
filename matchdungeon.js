let score = 0;
let pause = 0;
let level = 1;

let levelWalls = [];
let levelObstacles = [];
let levelEnemies = [];

const player = {
    x,
    y,
    w,
    h,
    health,
    facing,
}

function levelPopulate(){
    
}




/*---------------------------------------------------------
let ps;

let player = document.querySelector(".player");
let map = document.querySelector(".map");

let x = 100;
let y = 50;
let w = 32;
let directions = [];
let speed = 0.5;

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

    if(direction && collideCheck() === false){
        if(direction === playerDirections.right) {x += speed;}
        if(direction === playerDirections.left){x-= speed;}
        if(direction === playerDirections.down){y += speed;}
        if(direction === playerDirections.up){y -= speed;}
        player.setAttribute("facing", direction);
    } else {
        if(direction === playerDirections.right) {x -= 5;}
        if(direction === playerDirections.left){x+= 5;}
        if(direction === playerDirections.down){y -= 5;}
        if(direction === playerDirections.up){y += 5;} 
    }

    player.setAttribute("walking", direction ? "true" : "false");

    let lLimit = 0;
    let rLimit = 600 - 32;
    let tLimit = 0;
    let bLimit = 350 - 32;

    if (x < lLimit) {x = lLimit;}
    if (x > rLimit) {x = rLimit;}
    if (y < tLimit) {y = tLimit;}
    if (y > bLimit) {y = bLimit;}

    player.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;  
  
    
}

function collideCheck(){
    let boxX = 100;
    let boxY = 100;
    let boxW = 32;
   
    if (x < boxX + boxW && 
        x + w > boxX &&
        y < boxY + boxW &&
        y + w > boxY   )
        {
            return true;
        } 
        else {
            return false;
        }
}

function createBox(x,y){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","box");
    box.setAttribute("id","box");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x*ps}px, ${y*ps}px, 0 )`;

}

function init(){
    let up = document.getElementById("upArrow");
    let right = document.getElementById("rightArrow");
    let left = document.getElementById("leftArrow");
    let down = document.getElementById("downArrow");

    step();

    createBox(16,16);

    createBox(100,100);

}

const step = () => {
    placePlayer();
    window.requestAnimationFrame(() => {
       step();
    })
 }

document.addEventListener("keydown", (e) =>{
    let dir = keys[e.key];
    
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
--------------------------------------*/