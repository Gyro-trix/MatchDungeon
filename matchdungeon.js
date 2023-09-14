let score = 0;
let pause = 0;
let level = 1;
let speed = 4;

let solidCol = false;

let directions = [];

let isPressed = false;

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

function Enemy(x,y,w,strt,dest,axis){
    this.x = x;
    this.y = y;
    this.w = w;
    this.strt = strt;
    this.dest = dest;
    this.axis = axis;

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
            createSymbol(300,100,32);

            createEnemy(400,100,32,400,332,"x");
            createEnemy(200,300,32,300,220,"y");

            displayPlayer();
            
            createWall(50,50,32);
            createWall(50,82,32);
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

function createEnemy(x,y,w,strt,dest,axis){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","enemy");
    box.setAttribute("id","enemy "+ levelEnemies.length);
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

    let temp = new Enemy(x,y,w,strt,dest,axis);
    levelEnemies.push(temp);
}

function createSymbol(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","symbol");
    box.setAttribute("id","symbol");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    let temp = new Symbol(x,y,w);
    levelSymbols.push(temp);
}
/*
function createObstacle(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","obstacle");
    box.setAttribute("id","obstacle");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
}
*/
function playerMovement(){
    ps = pixelSize;
    const direction = directions[0];
    let plyr = document.getElementById("player");

    if(direction && collideWall() != false /*|| direction && collideEnemy() != false */){
        if(direction === playerDirections.right) {player.x += speed;}
        if(direction === playerDirections.left){player.x-= speed;}
        if(direction === playerDirections.down){player.y += speed;}
        if(direction === playerDirections.up){player.y -= speed;}
        plyr.setAttribute("facing", direction);
    } else /*if(collideEnemy() === true)*/{
        if(direction === playerDirections.right){player.x -= 10;}
        if(direction === playerDirections.left){player.x+= 10;}
        if(direction === playerDirections.down){player.y -= 10;}
        if(direction === playerDirections.up){player.y += 10;} 
    } 
    /*
    else if(collideWall() === true){
        if(direction === playerDirections.right){player.x -= 10;}
        if(direction === playerDirections.left){player.x+= 10;}
        if(direction === playerDirections.down){player.y -= 10;}
        if(direction === playerDirections.up){player.y += 10;} 
        healthDown();
    }
*/
    collideSymbol();
    if(collideEnemy() === false){
        player.x = 0;
        player.y = 0;
        healthDown();
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

function enemyMovement(){

    levelEnemies.forEach(moveEnemy);

}

function moveEnemy(obj,index){
    let x = obj.x;
    let y = obj.y;
    let strt = obj.strt;
    let dest = obj.dest;
    let enmy = document.getElementById("enemy "+ index);;

    if(obj.axis === "x" && obj.x < obj.dest){
        obj.x += speed/2;
    }
    else if(obj.axis === "x" && obj.x > obj.dest){
        obj.x -= speed/2;
    }
    else if(obj.axis === "y" && obj.y < obj.dest){
        obj.y += speed/2;
    } 
    else if((obj.axis === "y" && obj.y > obj.dest)){
        obj.y -= speed/2;
    }

    if (obj.axis === "x" && obj.x === obj.dest){
        obj.x = dest;
        obj.dest = strt;
        obj.strt = dest;
    } else if(obj.axis === "y" && obj.y === obj.dest) {
        obj.y = dest;
        obj.dest = strt;
        obj.strt = dest;
    }
    enmy.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
}

/* looping trough functions that need constant checking, may need to go back to frame checking*/
function gameLoop(){
    let fps = 30;
    playerMovement();
    enemyMovement();
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
    return levelWalls.every(collideWallCheck);
}

function collideWallCheck(obj){   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y);
}

function collideEnemy(){  
    return levelEnemies.every(collideEnemyCheck);
}

function collideEnemyCheck(obj){   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y)
           
        
}

function collideSymbol(){
    levelSymbols.every(collideSymbolCheck);
}

function collideSymbolCheck(obj, index){   
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

/* Player controls and inputs*/

document.addEventListener("keydown", (e) =>{
    let dir = keys[e.key];
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

/* D-pad functionality*/

const removePressedAll = () => {
   document.querySelectorAll("arrow").forEach(d => {
      d.classList.remove("pressed")
   })
}
document.body.addEventListener("mousedown", () => {
   console.log('mouse  down')
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
   console.log('mouse  up')
   isPressed = false;
   directions = [];
   removePressedAll();
})
const handleDpadPress = (direction, click) => {   
   if (click) {
      isPressed = true;
   }
   directions = (isPressed) ? [direction] : []
   
   if (isPressed) {
      removePressedAll();
      console.log(direction);
      document.querySelector("."+direction+"Arrow").classList.add("pressed");
   }
}

document.querySelector(".leftArrow").addEventListener("touchstart", (e) => handleDpadPress(playerDirections.left, true));
document.querySelector(".upArrow").addEventListener("touchstart", (e) => handleDpadPress(playerDirections.up, true));
document.querySelector(".rightArrow").addEventListener("touchstart", (e) => handleDpadPress(playerDirections.right, true));
document.querySelector(".downArrow").addEventListener("touchstart", (e) => handleDpadPress(playerDirections.down, true));

document.querySelector(".leftArrow").addEventListener("mousedown", (e) => handleDpadPress(playerDirections.left, true));
document.querySelector(".upArrow").addEventListener("mousedown", (e) => handleDpadPress(playerDirections.up, true));
document.querySelector(".rightArrow").addEventListener("mousedown", (e) => handleDpadPress(playerDirections.right, true));
document.querySelector(".downArrow").addEventListener("mousedown", (e) => handleDpadPress(playerDirections.down, true));

document.querySelector(".leftArrow").addEventListener("mouseover", (e) => handleDpadPress(playerDirections.left));
document.querySelector(".upArrow").addEventListener("mouseover", (e) => handleDpadPress(playerDirections.up));
document.querySelector(".rightArrow").addEventListener("mouseover", (e) => handleDpadPress(playerDirections.right));
document.querySelector(".downArrow").addEventListener("mouseover", (e) => handleDpadPress(playerDirections.down));

window.addEventListener("DOMContentLoaded", levelPopulate());
window.addEventListener("DOMContentLoaded", gameLoop());