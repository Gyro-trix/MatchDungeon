let score = 0;
let pause = 0;
let level = 1;
let speed = 2;

let solidCol = false;

let directions = [];

let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));

let levelWalls = [];
let levelSymbols = [];
let levelObstacles = [];
let levelEnemies = [];

function Wall(x,y,w){
    this.x = x;
    this.y = y;
    this.w = w;
}

function Symbol(x,y,w){
    this.x = x;
    this.y = y;
    this.w = w;
}

function Enemy(x,y,w,pstart,pend){
this.x = x;
this.y = y;
this.w = w;
this.pstart = pstart;
this.pend = pend;
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

            createSymbol(100,200,32);
            createSymbol(300,200,32);
            

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

function createEnemy(x,y,w,ps,pe){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","enemy");
    box.setAttribute("id","enemy");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

    let temp = new Enemy(x,y,w,ps,pe);
    levelEnemy.push(temp);
}

function createSymbol(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","symbol");
    box.setAttribute("id","symbol");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    let sym = new Symbol(x,y,w);
    levelSymbols.push(sym);
}

function createObstacle(x,y,w){
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

    if(direction && collideWall() != false){
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

    collideSymbol();
        

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



function scoreChange(num){
    score = score + num;
    document.getElementById("score").innerHTML = "";
    document.getElementById("score").innerHTML = score;
}

function levelChange(num){
    level = level + num;
    document.getElementById("level").innerHTML = "";
    document.getElementById("level").innerHTML = score;
}

function healthUp(){
    let con = document.getElementById("health");
    let div = document.createElement('div');
    div.setAttribute('id','heart');
    con.appendChild(div);
}

function healthDown(){
    let con = document.getElementById("health");
    player.health -= 1;
    con.removeChild(con.children[0]);
}

function collideWall(){  
    return levelWalls.every(collideCheck);
}

function collideSymbol(){
    levelSymbols.every(collideCheckRemove);
}

function collideCheck(obj){   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y);
}

function collideCheckRemove(obj, index){   
    if (player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y) {
            scoreChange(100);
            levelSymbols.splice(index, 1);
            let con = document.getElementById("map");
            con.removeChild(con.children[index]);
            return false;
        }
    
    
}



document.addEventListener("keydown", (e) =>{
    let dir = keys[e.key];
    console.log(e.key);
    if (dir && directions.indexOf(dir) === -1) {
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
