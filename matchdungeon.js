let score = 0;
let pause = false;
let level = 1;
let speed = 5;
let sec = 91;
let time;
let cursym = 0;

let solidCol = false;

let directions = [];

let isPressed = false;

let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));

let levelWalls = [];
let levelSymbols = [];
let levelObstacles = [];
let levelEnemies = [];
let levelArrows = [];

let symbolOffSet = 0;
let symbolSet = ["line","cross","asterik1","asterik2","Same as 1,2,3 then 4. Just not with numbers.",
                "roman1","roman2","roman3","roman4","Same as 1,2,3 then 4. Just not with numbers.",
                "one","two", "three","four","Lucky, just count up."];

let exit = new Object(0,0,0,0);

let attack = new Attack(-32,-32,32);

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

function Attack(x,y,w){
    this.x=x;
    this.y=y;
    this.w=w;
}

function Enemy(x,y,w,strt,dest,axis){
    this.x = x;
    this.y = y;
    this.w = w;
    this.strt = strt;
    this.dest = dest;
    this.axis = axis;
}

function Trap(x,y,w,facing,delay){
    this.x = x;
    this.y = y;
    this.w = w;
    this.facing = facing;
    this.delay = delay;
}

function Arrow(x,y,facing){
    this.x = x;
    this.y = y;
    this.facing = facing;
}

const player = {
    x:284,
    y:300,
    w:32,
    health:3,
    facing: "down",
    move: true,
    block: false,
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
    box.setAttribute("block","false");
    target.appendChild(box);

    box.style.transform = `translate3d( ${player.x}px, ${player.y}px , 0 )`;
}

function init(){
    document.getElementById("score").innerHTML = score;
    document.getElementById("level").innerHTML = level;
    
    let pbtn = document.getElementById("Pause");
    pbtn.addEventListener("click", toPause);

    let scrn = document.getElementById("screen");
    
    let pscrn = document.createElement('div');
    pscrn.setAttribute("class","screen pause");
    pscrn.setAttribute("id","screen pause");
    scrn.appendChild(pscrn);
    pscrn.style.visibility = "hidden";

    let iscrn = document.getElementById("screen info");
    iscrn.style.visibility = "hidden";

    let hscrn = document.createElement('div');
    hscrn.setAttribute("class","screen hint");
    hscrn.setAttribute("id","screen hint");
    scrn.appendChild(hscrn);
    hscrn.style.visibility = "hidden";

    let a = document.getElementById("A");
    a.addEventListener("click", playerAttack);
    let b = document.getElementById("B");
    b.addEventListener("click", playerBlock);
    let res = document.getElementById("reset");
    res.addEventListener("click", restart);
    let info = document.getElementById("info");
    info.addEventListener("click", infoPanel);
    let hint = document.getElementById("Hint");
    hint.addEventListener("click", hintPanel);
}

function levelPopulate(){
    
    
    switch (level){
        case 1:     
            document.getElementById("level").innerHTML = level;
            timer();    

            healthUp();
            healthUp();
            healthUp();

            createSymbol(100,200,32);
            createSymbol(100,100,32);
            createSymbol(300,200,32);
            createSymbol(300,100,32);

            createTrap(10,10,32,"right",0);

            createTrap(10,50,32,"right",500);

            symbolShuffle(levelSymbols);

            createExit(250,0,32,108);
            player.x = 284;
            player.y = 300;
            displayPlayer();
            
        break;
        case 2:
            document.getElementById("level").innerHTML = level;
            sec = 91;

            createSymbol(100,100,32);
            createSymbol(200,200,32);
            createSymbol(400,100,32);

            symbolShuffle(levelSymbols);

            createEnemy(400,100,32,400,332,"x");
            createEnemy(200,300,32,300,220,"y");

            createExit(246,0,32,108);
            player.x = 284;
            player.y = 300;
            displayPlayer();

        break;
        case 3:
            document.getElementById("level").innerHTML = level;
            sec = 91;

            createExit(246,0,32,108);
            player.x = 284;
            player.y = 300;
            displayPlayer();

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

function createTrap(x,y,w,facing,delay){
    let box = document.createElement('div');
    let target = document.getElementById("map");

    box.setAttribute("class","trap");
    box.setAttribute("id","trap");
    target.appendChild(box);
    
    setTimeout(function(){createArrow(x,y,facing);},delay)
    

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

}

function createArrow(x,y,facing){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.setAttribute("class","arrow");
    box.setAttribute("id","arrow " + levelArrows.length);
    box.setAttribute("facing",facing);
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

    let temp = new Arrow(x,y,facing);
    levelArrows.push(temp);
}

function createSymbol(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");
  
    let temp = new Symbol(x,y,w);
    levelSymbols.push(temp);
}

/* Shuffles and visually creates symbols*/
function symbolShuffle(array){
    for(let i = array.length -1; i>0;i--){
        let j = Math.floor(Math.random()*(i+1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
    for(let r = array.length -1; r >= 0; r--){
        let box = document.createElement('div');
        let target = document.getElementById("map");
        let obj = array[r];
        box.setAttribute("class","symbol");
        box.setAttribute("id","symbol " + r);
        box.style.backgroundImage = "url(sprites/"+ symbolSet[r+symbolOffSet]+".jpg)";
        target.appendChild(box);
        box.style.transform = `translate3d( ${obj.x}px, ${obj.y}px , 0 )`;
    }
}

function createExit(x,y,h,w){
    exit.x = x;
    exit.y = y;
    exit.h = h;
    exit.w = w;
    exit.state = "closed";

    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.innerHTML = "Closed Exit";

    box.setAttribute("class","exit");
    box.setAttribute("id","exit");
    target.appendChild(box);

    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

}


function playerMovement(){
    ps = pixelSize;
    const direction = directions[0];
    let plyr = document.getElementById("player");

    if(direction && collideWall() && player.move != false){
        if(direction === playerDirections.right) {player.x += speed;}
        if(direction === playerDirections.left){player.x-= speed;}
        if(direction === playerDirections.down){player.y += speed;}
        if(direction === playerDirections.up){player.y -= speed;}
        plyr.setAttribute("facing", direction);
        player.facing = direction;
    } else if (player.move === true){
        if(direction === playerDirections.right){player.x -= 10;}
        if(direction === playerDirections.left){player.x+= 10;}
        if(direction === playerDirections.down){player.y -= 10;}
        if(direction === playerDirections.up){player.y += 10;} 
    } 

    

    collideSymbol();
    collideExit();

    if (cursym === levelSymbols.length){
        exit.state = "open";
        console.log("exit open")
        let temp = document.getElementById("exit");
        temp.innerHTML = "Open Exit";
        cursym = 0;
    }


    if(collideEnemy() === false){
        player.x = 284;
        player.y = 300;
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

function playerAttack(){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let dir = player.facing;

    console.log(dir);
    player.move = false;
    box.setAttribute("class","attack");
    box.setAttribute("id","attack");
    target.appendChild(box);

    if(dir === "down"){
        attack.x = player.x;
        attack.y = player.y+32;
    }else if(dir === "up"){
        attack.x = player.x;
        attack.y = player.y-32;
    }else if(dir === "left"){
        attack.x = player.x-32;
        attack.y = player.y;
    }else if(dir=== "right"){
        attack.x = player.x+32;
        attack.y = player.y;
    }
    box.style.transform = `translate3d( ${attack.x}px, ${attack.y}px , 0 )`;

    levelEnemies.forEach(attackEnemyCheck);

    setTimeout(function(){
        box.remove();
        player.move = true;
   },500);
    
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
        obj.x += 2;
    }
    else if(obj.axis === "x" && obj.x > obj.dest){
        obj.x -= 2;
    }
    else if(obj.axis === "y" && obj.y < obj.dest){
        obj.y += 2;
    } 
    else if((obj.axis === "y" && obj.y > obj.dest)){
        obj.y -= 2;
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

function arrowMovement(){
    levelArrows.forEach(moveArrow);
}

function moveArrow(obj,index){
    let x = obj.x;
    let y = obj.y;
    let facing = obj.facing;
    let arrw = document.getElementById("arrow "+ index);
    let mp = document.getElementById("map");
    if (facing === "right") {
        if (obj.x <= 592){
            obj.x = obj.x + 2;
            arrw.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
        } 
        else {
            levelArrows[index] = "";
            mp.removeChild(arrw);
        }
    } else if(facing === "left"){

    } else if(facing === "up"){

    } else if(facing === "down"){
    
    }

    
}

function timer(){
    if (pause === false){
        time = setInterval(function(){
        document.getElementById('timer').innerHTML=sec-1;
        sec--;
        if (sec <= 0) {
            clearInterval(time);
            restart();
            }
        }, 1000);
        
    
    } else if(pause === true){
    
    
    clearInterval(time);
    
    }
    
}

/* looping trough functions that need constant checking, may need to go back to frame checking*/
function gameLoop(){
    let fps = 30;
   
    if (pause === false){
        playerMovement();
        enemyMovement();
        arrowMovement();
    }
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

function attackEnemy(){  
    return levelEnemies.every(attackEnemyCheck);
}

function attackEnemyCheck(obj,index){   
    if(attack.x <= obj.x + obj.w && 
        attack.x + attack.w >= obj.x &&
        attack.y <= obj.y+ obj.w &&
        attack.y + attack.w >= obj.y){
            scoreChange(100);
            levelEnemies[index] = " ";
            console.log(index);
            let box = document.getElementById("enemy "+ index);
            box.style.visibility = "hidden";
            
        }
}

function playerBlock(){
    let temp = document.getElementById("player");

    temp.setAttribute("block","true")
    player.move = false;
    player.block = true;

    setTimeout(function(){
        temp.setAttribute("block","false")
        player.move = true;
        player.block = false;
   },500);

}

function collideSymbol(){
    levelSymbols.forEach(collideSymbolCheck);
}

function collideSymbolCheck(obj, index){   
    if ((cursym === index)&&(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y)) {
            scoreChange(100);
            /* levelSymbols.splice(index, 1);*/
            levelSymbols[index] = " ";
            let temp = document.getElementById("symbol " + index)
            let con = document.getElementById("pattern");
            /*Need to transform symbol to fall in the right part of the pattern div*/
            con.appendChild(temp);
            temp.style.transform = `translate3d( ${index*32}px, ${0}px , 0 )`;
            cursym = cursym + 1;
            return false;
        }
    
}

function collideExit(){
    if((exit.state === "open")&&
        (player.x <= exit.x + exit.w && 
        player.x + player.w >= exit.x &&
        player.y <= exit.y + exit.h &&
        player.y + player.w >= exit.y)){
            scoreChange(1000);
            level = level + 1;
            console.log("Next Level " +level);
            exit.x = -1000;
            exit.y = -1000;
            levelComplete();
            
            
        }
}

function infoPanel(){
    let iscrn = document.getElementById("screen info");

    if(pause === true){
        iscrn.style.visibility = "hidden";
        pause = false;
        timer();
    } else if (pause === false){
        iscrn.style.visibility = "visible";
        pause = true;
        timer();
    }
}

function levelComplete(){
    let pltemp = document.getElementById("player");
    let pattemp = document.getElementById("pattern")
    /*let attemp = document.getElementById("attack");*/
    let storage = document.createElement('div');
    let maptemp = document.getElementById("map");
    storage.appendChild(pltemp);
    /*storage.appendChild(attemp);*/
    levelWalls = [];
    levelEnemies = [];
    levelSymbols = [];
    levelObstacles = [];
    maptemp.innerHTML = "";
    pattemp.innerHTML = "";
    levelPopulate();
    /* Move Player and attack out of map div
    Then empty map div. Call populate level with level incremented
    */ 
}

function toPause(){
    let pscrn = document.getElementById("screen pause");
    pscrn.innerHTML = "<h1>PAUSED</h1>";
    if(pause === true){
        pscrn.style.visibility = "hidden";
        pause = false;
        timer();
    } else if (pause === false){
        pscrn.style.visibility = "visible";
        pause = true;
        timer();
    }
}

function hintPanel(){
let hscrn = document.getElementById("screen hint");
    hscrn.innerHTML = symbolSet[4];
    if(pause === true){
        hscrn.style.visibility = "hidden";
        pause = false;
        timer();
    } else if (pause === false){
        hscrn.style.visibility = "visible";
        pause = true;
        timer();
    }
}

function restart(){
    /*sec = 91;*/
    location.reload();
}

function gameOver(){
    /* brings up a div with an option to restart entire game*/
}

function gameWin(){
    /* congratulations screen with total score displayed*/
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

document.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "Control"){
        playerAttack()
    }
    if (e.key === "Enter"){
        toPause();
    }
    if (e.key === "Shift"){
        playerBlock();
    }
    if (e.key === "z"){
        toPause();
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

window.addEventListener("DOMContentLoaded", init());
window.addEventListener("DOMContentLoaded", levelPopulate());
window.addEventListener("DOMContentLoaded", gameLoop());