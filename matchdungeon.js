let score = 0;
let pause = 0;
let level = 1;
let speed = 1;

let solidCol = false;

let directions = [];

let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));

let levelWalls = [];
let levelObstacles = [];
let levelEnemies = [];

function Wall(x,y,w){
    this.x = x;
    this.y = y;
    this.w = w;
}

const player = {
    x:0,
    y:0,
    w:32,
    health:3,
    facing:"down",
}

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

function displayPlayer(){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","player");
    box.setAttribute("id","player");
    box.setAttribute("facing","down");
    box.setAttribute("walking","false");
    target.appendChild(box);

    box.style.transform = `translate3d( ${player.x}px, ${player.y}px , 0 )`;
}

function levelPopulate(){
    switch (level){
        case 1:
            document.getElementById("score").innerHTML = level;
            document.getElementById("level").innerHTML = level;
            healthUp();
            healthUp();
            healthUp();
            displayPlayer();
            createWall(50,50,32);
            createWall(100,120,32);
            createWall(200,200,32);
        break;
        case 2:
            console.log(level);
        break;
        case 3:
            console.log(level);
        break;
    }
}

function createWall(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","wall");
    box.setAttribute("id","wall");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px , 0 )`;
    let wl = new Wall(x,y,w);
    levelWalls.push(wl);
}

function createEnemy(x,y){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","enemy");
    box.setAttribute("id","enemy");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
}

function createObstacle(x,y){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","obstacle");
    box.setAttribute("id","obstacle");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
}

function playerMovement(){
    ps = pixelSize;
    const direction = directions[0];
    let plyr = document.getElementById("player");

    if(direction && collider() != false){
        if(direction === playerDirections.right) {player.x += speed;}
        if(direction === playerDirections.left){player.x-= speed;}
        if(direction === playerDirections.down){player.y += speed;}
        if(direction === playerDirections.up){player.y -= speed;}
        plyr.setAttribute("facing", direction);
    } else {
        if(direction === playerDirections.right) {player.x -= 10;}
        if(direction === playerDirections.left){player.x+= 10;}
        if(direction === playerDirections.down){player.y -= 10;}
        if(direction === playerDirections.up){player.y += 10;} 
    }

    plyr.setAttribute("walking", direction ? "true" : "false");

    let lLimit = 0;
    let rLimit = 600 - 32;
    let tLimit = 0;
    let bLimit = 350 - 32;

    if (player.x < lLimit) {player.x = lLimit;}
    if (player.x > rLimit) {player.x = rLimit;}
    if (player.y < tLimit) {player.y = tLimit;}
    if (player.y > bLimit) {player.y = bLimit;}

    plyr.style.transform = `translate3d( ${player.x*pixelSize}px, ${player.y*pixelSize}px, 0 )`;  
}

/* looping trough functions that need constant checking, may need to go back to frame checking*/
function gameLoop(){
    let fps = 60;
    playerMovement();
    setTimeout(() => {
    window.requestAnimationFrame(() => {
        gameLoop();
     })
    }, 1000 / fps)
}

function collider(){
    console.log(levelWalls.every(collideCheck));   
    return levelWalls.every(collideCheck);

}

function scoreChange(num){
    score = score + num;
    document.getElementById("score").innerHTML = "";
    document.getElementById("score").innerHTML = score;
}

function healthUp(){
    let con = document.getElementById("health");
    let div = document.createElement('div');
    div.setAttribute('id','heart');
    con.appendChild(div);
}

function collideCheck(obj){
    console.log(obj.x);   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y);
       
}

document.addEventListener("keydown", (e) =>{
    let dir = keys[e.key];
    console.log(e.key);
    if (dir && directions.indexOf(dir) === -1) {
        console.log(dir);
        directions.unshift(dir);
    }
})

document.addEventListener("keyup", (e) => {
    let dir = keys[e.key];
    let index = directions.indexOf(dir);
    if (index > -1){
        directions.splice(index, 1)
    }
})

window.addEventListener("DOMContentLoaded", levelPopulate());
window.addEventListener("DOMContentLoaded", gameLoop());

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