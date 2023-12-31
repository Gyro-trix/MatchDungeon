const fps = 30;
let startx = 284;
let starty = 300;
//Offset for player collision, may allow for difficulty options
let offset = 8;
//Prevents inputs from certain event handlers
let pdisable = false;
let idisable = false;
let hdisable = false;
//First dialogue then any key works
let first = true;
let score = 0;
let prevscore = 0;
let pause = false;
//Starting Level
let level = 1;
//Max levels, used for randomizing symbols
let maxlevel = 3;
//Player speed
let speed = 6;
//Player is invincible or not, for iFrames
let inv = false;
let sec = 91;
let elasped = 0;
let time;
let cursym = 0;
let infoindex = 0;
let solidCol = false;
let directions = [];
let isPressed = false;
//Grabs the pixel size from the css file
let pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
//Arrays to store current level objects
let levelWalls = [];
let levelSymbols = [];
let levelObstacles = [];
let levelEnemies = [];
let levelGhosts = [];
let levelTraps = [];
let levelArrows = [];
let levelHoles = [];
let levelSafeZones = [];
let levelTriggers = [];
let arrowIntervals = [];
//Symbol possibilities with corresponding hint for correct order
let symbolOffSet = [0,5,10,15];
let symbolSet = ["line","cross","asterik1","asterik2","<p>Counting up, just with lines</p>",
                "roman1","roman2","roman3","roman4","<p>Increase in value, just not your everyday numbers.</p>",
                "one","two", "three","four","<p>Lucky, just count up.</p>",
                "point","blade","guard","pommel","<p>From point to pommel.</p>",
                "O","P","E","N", "<p>What you want the exit to do.</p>",
                "tri","square","penta","hexa","<p>All about the sides.</p>"];
//Contents of the Info Panel
let infocontents = [];
infocontents[0] ="<h2>Controls:</h2> <p>Use the on screen arrows or the arrow keys on the keyboard.</p><p>The A button or Crtl on the keyboard attacks, sending out a box in teh direction you are facing.</p><p>The B button or Shift on the keyboard blocks.</p>";
infocontents[1] ="<h2>Obstacles:</h2> <p>Note, only for the test version</p><p>Arrows can be blocked with B/SHIFT.</p><p>Moving red boxes are enemies that can be attacked, touching them causes health lose and a small span of invulnerability.</p> <p>Darker floor areas are holes, which move you back to start and loose health.</p><p>Purple boxes move when you are not inside a yellow area, hitting one causes health lose and the purple box to blink back to it's starting location.</p>";
infocontents[2] ="<h2>Objectives:</h2> <p>Before the timer reaches zero or you go to zero health (no hearts left) collect all symbols in the right order.</p><p>The hint button can provide help with the symbol order.</p><p>Once the symbols are collected head to the open exit to go to the next level</p>";
let exit = new Object(0,0,0,0);
let attack = new Attack(-64,-64,32);
// Generic Game Object with coordinates, width, height, id, and were it is facing(Implemented late, hoping to use this accress all game objects)
function GameObject(x,y,w,h,id,facing){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.facing = facing;
}
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
//Object representing the player, x and y coordinates, width, health, facing, can player move?, player blocking?, player in safe zone?
const player = {
    x:startx,
    y:starty,
    w:32,
    health:0,
    facing: "down",
    move: true,
    block: false,
    safe: false,
}
//Object containing strings of directions for event listeners
const playerDirections = {
    up: "up",
    down: "down",
    left: "left",
    right: "right",
}
//Associated keys for the above directions, might be able to create a rebind key option?
const keys = {
    ArrowUp: playerDirections.up,
    ArrowLeft: playerDirections.left,
    ArrowRight: playerDirections.right,
    ArrowDown: playerDirections.down,
}
function spriteAnimate(id,intv,offsetx,offsety,frame,loop){
    let temp = document.getElementById(id);
    let offx = -offsetx;
    let offy = -offsety;
    let curframe = 1;
    let anim = setInterval(function(){
        if (curframe != frame){
            temp.style.backgroundPosition = offx+"px "+offy+"px";
            if(curframe != frame){offx -= offsetx;} else {offx = offsetx;}
            if(loop === false){curframe++;} else {curframe = 1;}
        } else if (curframe === frame){
            return;
        }
        
    },intv);
    if(id === "player"){
    document.addEventListener("keyup", (e) => {
            clearInterval(anim);
        })
    }    
}

//Randomizes the off set array for choosing a different image set for symbols
function symbolOffSetRandomizer(){
    for(let v = symbolOffSet.length - 1; v>0;v--){
        let j = Math.floor(Math.random()*(v+1));
        let t = symbolOffSet[v];
        symbolOffSet[v] = symbolOffSet[j];
        symbolOffSet[j] = t;
    }
}
//Creates and places the player
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
// Initialize and some html content 
function init(){
    while(player.health < 3){
        healthUp();
    }
    symbolOffSetRandomizer();
    sec = 999;
    timer();
    elapsed = 0;
    document.getElementById("scre").innerHTML = score;
    document.getElementById("level").innerHTML = level;
    let scrn = document.getElementById("screen");
    //Create pause div and hide it
    let pscrn = document.createElement('div');
    pscrn.setAttribute("class","screen pause");
    pscrn.setAttribute("id","screen pause");
    scrn.appendChild(pscrn);
    pscrn.style.visibility = "hidden";
    infoCreate();
    //Create hint div and hide it
    let hscrn = document.createElement('div');
    hscrn.setAttribute("class","screen hint");
    hscrn.setAttribute("id","screen hint");
    scrn.appendChild(hscrn);
    hscrn.style.visibility = "hidden";
    //Create dialogue div and hide it
    let dscrn = document.createElement('div');
    dscrn.setAttribute("class","screen dialogue");
    dscrn.setAttribute("id","screen dialogue");
    scrn.appendChild(dscrn);
    dscrn.style.visibility = "hidden";
    //On screen buttons event handlers
    let pbtn = document.getElementById("Pause");
    pbtn.addEventListener("click", toPause);
    let a = document.getElementById("A");
    a.addEventListener("click", playerAttack);
    let b = document.getElementById("B");
    b.addEventListener("mousedown", playerBlock);
    b.addEventListener("mouseup", playerBlock);
    let res = document.getElementById("reset");
    res.addEventListener("click", restart);
    let info = document.getElementById("info");
    info.addEventListener("click", infoPanel);
    let hint = document.getElementById("Hint");
    hint.addEventListener("click", hintPanel);
}
//Populates each level, each case is a different level/layout
//To create a new level, add a new case, the level is populated with the various create functions
function levelPopulate(){
    switch (level){
        //Title Screen, not yet implemented
        case 0:

        break;
        //Intro/tutorial Level, one of each mechanic with on screen popups, not meant to be difficult
        case 4:
            let triggerone =    "<p>Welcome to the tutorial level! To move use either the arrow keys on the keyboard or the arrows to the left. This dialogue popup can be closed by pressing any key. Following ones can be closed by clicking the X in the upper right of the popup.</p>";
            let triggertwo =    "<p>See the closed exit to the left, that is your goal. Be careful, as to the left(shaded area) are holes that cause you to lose health and be put back to start if you move into it. When health reaches zero the level restarts.</p>"
            let triggerthree =  "<p>Attack using the A button to the right or pressing CRTL on the keyboard. Touching the patrolling red square above will cause you to lose one health and gain one second of invincibilty.</p>"
            let triggerfour =   "<p>See those yellow tipped arrows, getting hit will cause you to lose a health. The B button or SHIFT on the keyboard makes you block, which prevents the health lose.</p>"
            let triggerfive =   "<p>See the purple block, it will chase you down and hit you, the yellow area to the left scares the purple block off. Getting hit by the purple block causes you to lose a health and the ghost goes back to where it started.</p>"
            let triggersix =    "<p>Notice the exit says it is closed, you need to collect symbols in the right order to open the door. The hint button to the right can help with that. However these are lined up nicely for you. Grab them and head to the exit.</p>"
            document.getElementById("level").innerHTML = level;
            sec = 91;
            startx = 560;
            starty = 16;
            player.x = startx;
            player.y = starty;
            score = prevscore;
            createSafeZone(0,0,96,352);    
            dialoguePanel(triggerone);
            createTrigger(512,0,32,352,function(){dialoguePanel(triggertwo);});
            createTrigger(416,96,64,64,function(){dialoguePanel(triggerthree);});
            createTrigger(320,192,64,64,function(){dialoguePanel(triggerfour);});
            createTrigger(128,64,64,64,function(){createGhost(572,0,32); dialoguePanel(triggerfive); });
            createTrigger(0,256,96,96,function(){dialoguePanel(triggersix); });
            createHole(96,0,32,256);
            createHole(192,128,32,224);
            createHole(192,0,32,64);
            createHole(224,32,64,32);
            createHole(288,0,32,256);
            createHole(384,96,32,256);
            createHole(480,0,32,256);
            createEnemy(320,32,32,320,448,"x");
            createTrap(224,0,32,"down",0);
            createTrap(256,0,32,"down",0);          
            createSymbol(32,224,32);
            createSymbol(32,160,32);
            createSymbol(32,96,32);
            createSymbol(32,32,32);
            arrayCoordShuffle(levelSymbols);
            createExit(0,0,32,96);
            displayPlayer();
            arrowBarrage();
        break;
        case 2:
            document.getElementById("level").innerHTML = level;
            sec = 91;
            startx = 576;
            starty = 320;
            player.x = startx;
            player.y = starty;
            score = prevscore;
            //timer();
            createSymbol(432,240,32);
            createSymbol(240,144,32);
            createSymbol(560,48,32);
            createSymbol(432,48,32);
            createHole(0,288,512,32);
            createHole(512,288,32,64);
            createHole(64,192,544,32);
            createHole(0,96,544,32);
            createHole(96,0,544,32);
            createEnemy(16,128,32,128,256,"y");
            createEnemy(560,32,32,32,160,"y");
            createTrap(64,320,32,"up",0);
            createTrap(96,320,32,"up",0);
            createTrap(192,320,32,"up",0);
            createTrap(224,320,32,"up",0);
            createTrap(256,320,32,"up",0);
            createTrap(288,320,32,"up",0);
            createTrap(384,320,32,"up",0);
            createTrap(416,320,32,"up",0);
            createTrap(448,320,32,"up",0);
            createTrap(480,320,32,"up",0);
            createExit(0,0,32,96);
            createSafeZone(560,288,64,64);   
            
            displayPlayer();
            arrowBarrage();
        break;
        case 3:     
            document.getElementById("level").innerHTML = level;
            sec = 91;
            startx = 284;
            starty = 300;
            player.x = startx;
            player.y = starty;
            createSafeZone(284,300,64,64);    
            createGhost(0,0,32);
            createSymbol(80,32,32);
            createSymbol(80,200,32);
            createSymbol(504,16,32);
            createSymbol(456,200,32);
            createHole(32,0,32,250);
            createHole(128,0,32,96);
            createHole(128,282,32,80);
            createHole(0,250,504,32);
            createHole(504,154,32,128);
            createHole(340,154,164,32);
            createHole(404,64,204,32);
            createHole(64,154,96,32);
            createEnemy(368,16,32,16,100,"y");
            createTrap(0,200,32,"right",0);
            createTrap(80,300,32,"up",500);
            createExit(250,0,32,108);
            displayPlayer();
            arrowBarrage();
            
        break;
        
        //Not yet implemented, still working on more level layouts
        case 1:
            document.getElementById("level").innerHTML = level;
            sec = 91;
            createExit(512,320,32,108);
            startx = 0;
            starty = 0;
            player.x = startx;
            player.y = starty;
            displayPlayer();
        break;
    }
}
//Called on each game loop, handles updating the player position, health, collision status
function playerMovement(){
    ps = pixelSize;
    const direction = directions[0];
    let plyr = document.getElementById("player");
    if(direction && collideWall() && player.move != false){
        if(direction === playerDirections.right) {player.x += speed; spriteAnimate("player",300,32,32,4,true);}
        if(direction === playerDirections.left){player.x-= speed; spriteAnimate("player",300,32,96,4,true);}
        if(direction === playerDirections.down){player.y += speed; spriteAnimate("player",300,32,0,4,true);}
        if(direction === playerDirections.up){player.y -= speed; spriteAnimate("player",300,32,64,4,true);}
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
    collideArrows();
    collideGhost();
    collideTriggers();
    if (cursym === levelSymbols.length && exit.state === "closed"){
        exit.state = "open";
        spriteAnimate("exit",300,108,0,8,false); 
        cursym = 0;
    }
    if(collideEnemy() === false && inv === false){
        playerIFrames(1000);
        healthDown();
    }
    if(collideHole() === false){
        player.x = startx;
        player.y = starty;
        healthDown();
    }
    if(collideSafeZones() === false){
        player.safe = true;
    } else {
        player.safe = false;
    }
    if(player.health === 0){
        gameOver();
    }
    plyr.setAttribute("walking", direction ? "true" : "false");
    // Sets the boundaries to prevent the player from moving outside the play space
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
// Creates a box in front of the player which can destroy enemies (only enemies)
function playerAttack(){
    if ( pause === false){
    attack.x = player.x;
    attack.y = player.y;
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let dir = player.facing;
    let count = 0;
    player.move = false;
    box.setAttribute("class","attack");
    box.setAttribute("id","attack");
    target.appendChild(box);
    box.style.transform = `translate3d( ${attack.x}px, ${attack.y}px , 0 )`;
    let interval = setInterval(function(){
        count = count + 1;
        if(dir === "down"){
            attack.y = attack.y+4;
        }else if(dir === "up"){
            attack.y = attack.y-4;
        }else if(dir === "left"){
            attack.x = attack.x-4;
        }else if(dir=== "right"){
            attack.x = attack.x+4;
        }
        box.style.transform = `translate3d( ${attack.x}px, ${attack.y}px , 0 )`;
        levelEnemies.forEach(attackEnemyCheck);
        if (count === 9){
            clearInterval(interval);
            box.remove();
        player.move = true;
        }
    },40);
    }
}
//Called to enable player blocking
function playerBlock(){
    if (pause === false){
    let temp = document.getElementById("player");
    if (player.block === false){
        temp.setAttribute("block","true");
        player.block = true;
        player.move = false;
    } else if (player.block === true){
        temp.setAttribute("block","false")
        player.move = true;
        player.block = false;
    }
}
}
//Make player invincible to damage (does not include holes) for a duration in milliseconds and causes player to blink
function playerIFrames(dur){
    let ply = document.getElementById("player");
    inv = true;
    ply.style.animation = 'blinker .25s linear infinite'
    setTimeout(function(){
        ply.style.animation = 'none';
        inv = false;
    },dur);
}
//creates a wall(currently collision reaction is a bit off)
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
//Creates an enemy, adds to array of enemies
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
//Creates a ghost that follows the player
function createGhost(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.setAttribute("class","ghost");
    box.setAttribute("id","ghost "+ levelGhosts.length);
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    let temp = new Enemy(x,y,w);
    temp.stx = x;
    temp.sty = y;
    levelGhosts.push(temp);
}
//creates a trap, used as an arrow spawn point
function createTrap(x,y,w,facing,delay){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.setAttribute("class","trap");
    box.setAttribute("id","trap");
    target.appendChild(box);
    
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;

    let trp = new Trap(x,y,w,facing,delay);
    levelTraps.push(trp);
    
}
//creates an arrow, adds to an array of arrows
function createArrow(x,y,facing){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let img = document.createElement("img");
    img.setAttribute("src","sprites/TrapArrow.png");
    if (facing === "up"){
    //Do Nothing
    } else if (facing === "down"){
        img.style.transform = `translate3d( ${0}px, ${-16}px , 0 )`;
        img.style.transform += 'rotate(180deg)';
    } else if (facing === "right"){
        img.style.transform = `translate3d( ${-8}px, ${-8}px , 0 )`;
        img.style.transform += 'rotate(90deg)';
    } else if (facing === "left"){
        img.style.transform = `translate3d( ${8}px, ${-8}px , 0 )`;
        img.style.transform += 'rotate(270deg)';
    }
    box.appendChild(img);
    box.setAttribute("class","arrow");
    box.setAttribute("id","arrow " + levelArrows.length);
    box.setAttribute("facing",facing);
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    let temp = new Arrow(x,y,facing);
    levelArrows.push(temp);
}
//creates a symbol, adds to an array of symbols
function createSymbol(x,y,w){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.setAttribute("class","symbol");
    box.setAttribute("id","symbol " + levelSymbols.length);
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    let temp = new Symbol(x,y,w);
    levelSymbols.push(temp);
    let r = levelSymbols.length - 1;
    box.style.backgroundImage = "url(sprites/"+ symbolSet[r+symbolOffSet[level-1]]+".png)";
}
//Shuffles the visual placement of the symbols, not the required order to be acquired
function arrayCoordShuffle(array){
    let coordinates = [];
    //Create an array of just the coordinates of symbols
    for(let i = 0; i < array.length ; i++){
        let temp = new GameObject(array[i].x,array[i].y);
        coordinates.push(temp);
    }
    //Randomize the corrdinates
    for(let v = coordinates.length - 1; v>0;v--){
        let j = Math.floor(Math.random()*(v+1));
        let t = coordinates[v];
        coordinates[v] = coordinates[j];
        coordinates[j] = t;
    }
    //Places symbols based on new coordinates
    for(let r = array.length -1; r >= 0; r--){
        let box = document.getElementById("symbol " + r);
        array[r].x = coordinates[r].x;
        array[r].y = coordinates[r].y;
        box.style.transform = `translate3d( ${array[r].x}px, ${array[r].y}px , 0 )`;
    }
}
//Creates the exit point for the level
function createExit(x,y,h,w){
    exit.x = x;
    exit.y = y;
    exit.h = h;
    exit.w = w;
    exit.state = "closed";
    let box = document.createElement('div');
    let target = document.getElementById("map");
    box.setAttribute("class","exit");
    box.setAttribute("id","exit");
    box.style.width = ''+w+'px';
    box.style.height = ''+h+'px';
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
}
//creates a hole that sends the player back to start and cost a health
function createHole(x,y,w,h){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let id = "hole";
    box.setAttribute("class","hole");
    box.setAttribute("id","hole");
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    box.style.width = ''+w+'px';
    box.style.height = ''+h+'px';
    let temp = new GameObject(x,y,w,h,id);
    levelHoles.push(temp);
}
//Creates a safe zone of size w by h where ghost do not chase the player
function createSafeZone(x,y,w,h){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let id = "safezone";
    box.setAttribute("class","safezone");
    box.setAttribute("id","safezone");
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    box.style.width = ''+w+'px';
    box.style.height = ''+h+'px';
    let temp = new GameObject(x,y,w,h,id);
    levelSafeZones.push(temp);
}
//Creates a safe zone of size w by h where ghost do not chase the player
function createTrigger(x,y,w,h,func){
    let box = document.createElement('div');
    let target = document.getElementById("map");
    let id = "trigger";
    box.setAttribute("class","trigger");
    box.setAttribute("id","trigger");
    target.appendChild(box);
    box.style.transform = `translate3d( ${x}px, ${y}px , 0 )`;
    box.style.width = ''+w+'px';
    box.style.height = ''+h+'px';
    let temp = new GameObject(x,y,w,h,id);
    temp.state = true;
    temp.func = func;
    levelTriggers.push(temp);
}
//Applies movement across all enemies in the array
function enemyMovement(){
    levelEnemies.forEach(moveEnemy);
}
//Basic movement of a single enemy object
function moveEnemy(obj,index){
    let x = obj.x;
    let y = obj.y;
    let strt = obj.strt;
    let dest = obj.dest;
    let enmy = document.getElementById("enemy "+ index);;
    if(obj.axis === "x" && obj.x < obj.dest){
        obj.x += 2;
        enmy.innerHTML = "&#129082;";
    }
    else if(obj.axis === "x" && obj.x > obj.dest){
        obj.x -= 2;
        enmy.innerHTML = "&#129080;";
    }
    else if(obj.axis === "y" && obj.y < obj.dest){
        obj.y += 2;
        enmy.innerHTML = "&#129083;";
    } 
    else if((obj.axis === "y" && obj.y > obj.dest)){
        obj.y -= 2;
        enmy.innerHTML = "&#129081;";
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
//Applies movement to all ghost objects 
function ghostMovement(){
    levelGhosts.forEach(moveGhost);
}
//Basic movement of ghosts objects
function moveGhost(obj,index){
    let xDistance;
    let yDistance;
    let speed;
    let ghst = document.getElementById("ghost "+ index);
    if (player.safe === false){
        xDistance = obj.x - player.x;
        yDistance = obj.y - player.y;
        xytotal = xDistance + yDistance;
        if (xytotal > 100){
            speed = 0.02;
        }
        else if (xytotal <= 100 && xytotal > 75){
            speed = 0.03;
        } else if (xytotal <= 75){
            speed = 0.04;
        }
        obj.x -= xDistance * speed;
        obj.y -= yDistance * speed;
    } else if (player.safe === true){
        xDistance = obj.x - obj.stx;
        yDistance = obj.y - obj.sty;
        xytotal = xDistance + yDistance;
        if (xytotal > 100){
            speed = 0.03;
        }
        else if (xytotal <= 100 && xytotal > 75){
            speed = 0.04;
        } else if (xytotal <= 75){
            speed = 0.05;
        }
        
        obj.x -= xDistance * speed;
        obj.y -= yDistance * speed;
    }
    
    ghst.style.transform = `translate3d( ${obj.x*pixelSize}px, ${obj.y*pixelSize}px, 0 )`;
}
//applies arrow spawning to all created spawn points, linked to the trap objects
function arrowBarrage(){
    levelTraps.forEach(arrowFire);
}
//Spawning of arrows
function arrowFire(obj,index){
    let x = obj.x;
    let y = obj.y;
    let facing = obj.facing;
    let delay = obj.delay;
    let count = 0;
    //Adjusts spawn location towards middle of origin image
    if (facing === "right" || facing === "left"){
        y = y + 8;
    } else if(facing === "up" || facing === "down"){
        x = x + 8;
    }
    setTimeout(function(){
        arrowIntervals.push(window.setInterval(function(){
            if(pause === false){if (count === 300) {createArrow(x,y,facing); count = 0;} count++;}
        },1));
    },delay);
}
//applies movement across all arrow objects in the array
function arrowMovement(){
    levelArrows.forEach(moveArrow);
}
//movement and interactions for a single arrow
function moveArrow(obj,index){
    let x = obj.x;
    let y = obj.y;
    let facing = obj.facing;
    let arrw = document.getElementById("arrow "+ index);
    let mp = document.getElementById("map");
    if (facing === "right") {
        if (obj.x <= 584){
            obj.x = obj.x + 6;
            arrw.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
        } 
        else {
            levelArrows[index] = "";
            mp.removeChild(arrw);
        }
    } else if(facing === "left"){
        if (obj.x >= 0){
            obj.x = obj.x - 6;
            arrw.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
        } 
        else {
            levelArrows[index] = "";
            mp.removeChild(arrw);
        }
    } else if(facing === "up"){
        if (obj.y >= 0 ){
            obj.y = obj.y - 6;
            arrw.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
        } 
        else {
            levelArrows[index] = "";
            mp.removeChild(arrw);
        }
    } else if(facing === "down"){
        if (obj.y <= 384 ){
            obj.y = obj.y + 6;
            arrw.style.transform = `translate3d( ${x*pixelSize}px, ${y*pixelSize}px, 0 )`;
        } 
        else {
            levelArrows[index] = "";
            mp.removeChild(arrw);
        }
    }
}
// Timer that will end the game at zero
function timer(){
    if (pause === false){
        time = setInterval(function(){
        document.getElementById('timer').innerHTML=sec-1;
        sec--;
        if (sec <= 0) {
            clearInterval(time);
            levelComplete();
            }
        }, 1000);    
    } else if(pause === true){
        clearInterval(time);
    }    
}
// Game Loop, everything that needs to stay updated during gameplay
function gameLoop(){
    if (pause === false){
        playerMovement();
        enemyMovement();
        ghostMovement();
        arrowMovement();
    }
    setTimeout(() => {
    window.requestAnimationFrame(() => {
    gameLoop();
     })
    }, 1000/fps)
}
// adds to the score by an amount, num
function scoreChange(num){
    score = score + num;
    document.getElementById("scre").innerHTML = "";
    document.getElementById("scre").innerHTML = score;
}
// changes level by an amount, num
function levelChange(num){
    level = level + num;
    document.getElementById("level").innerHTML = "";
    document.getElementById("level").innerHTML = level;
}
//Increases health by one
function healthUp(){
    let con = document.getElementById("health");
    let div = document.createElement('div');
    player.health += 1;
    div.setAttribute('id','heart');
    con.appendChild(div);    
}
//decrease health by one
function healthDown(){
    let con = document.getElementById("health");
    player.health -= 1;
    con.removeChild(con.children[0]);
}
//------------------------------------------------------------Collision Checkes Start Here---------------------------------------------------------
//Check for collisions of wall objects with the player
function collideWall(){  
    return levelWalls.every(collideWallCheck);
}
//Check for player wall collision on a single object
function collideWallCheck(obj){   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y);
}
//Collision with holes, sending player back to start and losing a health
function collideHole(){  
    return levelHoles.every(collideHoleCheck);
}
//Check for player wall collision on a single object
function collideHoleCheck(obj){   
    return !(player.x + offset <= obj.x + obj.w && 
        player.x + player.w - offset>= obj.x &&
        player.y + offset<= obj.y + obj.h &&
        player.y + player.w - offset>= obj.y);
}
//applies collision check to each safe zone in the level
function collideSafeZones(){  
    return levelSafeZones.every(collideSafeZoneCheck);
}
//Check for collision between player and safezone
function collideSafeZoneCheck(obj){   
    return !(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y + obj.h &&
        player.y + player.w >= obj.y);
}
//Applies collision to all Trigger objects
function collideTriggers(){  
    levelTriggers.forEach(collideTriggerCheck);
}
//collision check between player and invisible trigger 
function collideTriggerCheck(obj){   
    if ((player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y + obj.h &&
        player.y + player.w >= obj.y)
        &&(obj.state === true)){
            obj.func();
            obj.state = false;
        }
}
//Applies collision check across all enemies in the array(play space)
function collideEnemy(){  
    return levelEnemies.every(collideEnemyCheck);
}
//collision check between player and a single enemy
function collideEnemyCheck(obj){   
    return !(player.x + offset<= obj.x + obj.w && 
        player.x + player.w - offset>= obj.x &&
        player.y + offset<= obj.y+ obj.w &&
        player.y + player.w - offset >= obj.y)
}
//Applies collision check across all enemies in the array(play space)
function collideGhost(){  
    levelGhosts.forEach(collideGhostCheck);
}
//collision check between player and a single enemy
function collideGhostCheck(obj,index){   
    let temp = document.getElementById("ghost " + index);
   if (player.x + offset<= obj.x + obj.w && 
        player.x + player.w - offset>= obj.x &&
        player.y + offset<= obj.y + obj.w &&
        player.y + player.w - offset>= obj.y){
            obj.x = obj.stx;
            obj.y = obj.sty;
            temp.style.transform = `translate3d( ${obj.x}px, ${obj.y}px , 0 )`;
            healthDown();
        }
}
//Applies collision check across all arrows in the array(play space)
function collideArrows(){  
    return levelArrows.forEach(collideArrowCheck);
}
//collision check between player and a single arrow, and if player is blocking or not
function collideArrowCheck(obj,index){   
   let mtemp = document.getElementById("map");
   let temp = document.getElementById("arrow " + index);
   if (player.x <= obj.x && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y &&
        player.y + player.w >= obj.y){
            if (player.block === false) {
                healthDown();
                mtemp.removeChild(temp);
                levelArrows[index] = " "; 
            } else if (player.block === true){
                mtemp.removeChild(temp);
                levelArrows[index] = " ";
            }
        }
}
// Check with each enemy in the play area if they collide with the players attack
function attackEnemy(){  
    return levelEnemies.every(attackEnemyCheck);
}
// Check collision with player attack and enemies
function attackEnemyCheck(obj,index){   
    if(attack.x <= obj.x + obj.w && 
        attack.x + attack.w >= obj.x &&
        attack.y <= obj.y+ obj.w &&
        attack.y + attack.w >= obj.y){
            scoreChange(100);
            levelEnemies[index] = " ";
            let box = document.getElementById("enemy "+ index);
            box.style.visibility = "hidden";
        }
}
//Applies player and symbol collision check to all symbols
function collideSymbol(){
    levelSymbols.forEach(collideSymbolCheck);
}
//Checks for collision between player and symbol
function collideSymbolCheck(obj, index){   
    if ((cursym === index)&&(player.x <= obj.x + obj.w && 
        player.x + player.w >= obj.x &&
        player.y <= obj.y+ obj.w &&
        player.y + player.w >= obj.y)) {
            scoreChange(100);
            /* levelSymbols.splice(index, 1);*/
            levelSymbols[index] = " ";
            let temp = document.getElementById("symbol " + index)
            let con = document.getElementById("slot " + index);
            /*Need to transform symbol to fall in the right part of the pattern div*/
            con.appendChild(temp);
            temp.style.transform = `translate3d( ${0}px, ${0}px , 0 )`;
            temp.style.width = "64px";
            temp.style.height = "64px";
            cursym = cursym + 1;
            return false;
    }
}
//Check for collision of player and exit, if not open nothing happens
function collideExit(){
    if((exit.state === "open")&&
        (player.x <= exit.x + exit.w && 
        player.x + player.w >= exit.x &&
        player.y <= exit.y + exit.h &&
        player.y + player.w >= exit.y)){
            scoreScreen();
            level += 1;
            exit.x = -1000;
            exit.y = -1000;
            levelComplete();            
        }
}
//Score screen for end of level to show time bonus, exit bonus, and allow to proceed to next level
function scoreScreen(){
    let timebonus = sec * 10;
    let exitbonus = 1000;
    let tempscr = document.createElement('div');
    let target = document.getElementById("screen")
    pause = true;
    timer();
    scoreChange(exitbonus+timebonus);
    tempscr.setAttribute("class","screen score");
    tempscr.setAttribute("id","screen score");
    let stext = document.createElement('div');
    stext.setAttribute("class","stext");
    stext.setAttribute("id","stext"); 
    let scrnexit = document.createElement('div');
    scrnexit.setAttribute("class","scrnexit");
    scrnexit.setAttribute("id","scrnexit");
    scrnexit.innerHTML = "X";
    stext.innerHTML = "Level Complete <br>";
    stext.innerHTML += "Time Bonus : "+ timebonus + "<br>";
    stext.innerHTML += "Exit Bonus : "+ exitbonus + "<br>";
    stext.innerHTML += "Score Total: "+ score + "<br>";
    target.appendChild(tempscr);
    tempscr.appendChild(scrnexit);
    tempscr.appendChild(stext);
    let xbtn = document.getElementById("scrnexit");
    xbtn.addEventListener("click", function(){ pause = false;
        tempscr.style.visibility = "hidden";
        timer();
        tempscr.innerHTML = "";});
    document.addEventListener("keydown",(e) => {
        if (!e.repeat && pause === true){
            pause = false;
            tempscr.style.visibility = "hidden";
        timer();
        tempscr.innerHTML = "";}
    });
    tempscr.style.visibility = "visible";
}
//Creates the info screen/div
function infoCreate(){
    let box = document.createElement('div');
    let content = document.createElement('div');
    let pbutton = document.createElement('Button');
    let nbutton = document.createElement('Button');
    let target = document.getElementById("map");
    box.setAttribute("class","screen info");
    box.setAttribute("id","screen info");
    content.setAttribute("class","content");
    content.setAttribute("id","content");
    pbutton.setAttribute("class","pbutton");
    pbutton.setAttribute("id","pbutton");
    nbutton.setAttribute("class","nbutton");
    nbutton.setAttribute("id","nbutton");
    target.appendChild(box);
    pbutton.innerHTML = "&#11164;";
    nbutton.innerHTML = "&#11166;";
    box.appendChild(pbutton);
    box.appendChild(content);
    content.innerHTML = infocontents[infoindex];
    box.appendChild(nbutton);
    
    pbutton.addEventListener("click", function(){infoChange("p")});
    pbutton.disabled = true;
    nbutton.addEventListener("click", function(){infoChange("n")});
    box.style.visibility = "hidden";
}
//Handles multiple page info screen
function infoChange(state){
    let temp = document.getElementById("content");
    let pbtemp = document.getElementById("pbutton");
    let nbtemp = document.getElementById("nbutton");
    let upper = 2; 
  
    if (state ==="p"){
        infoindex = infoindex - 1;
    }
    else if (state === "n"){
        infoindex = infoindex + 1;
    }

    if (infoindex === 0){
        pbtemp.disabled = true;
        temp.innerHTML = infocontents[infoindex];
    }
    else if(infoindex != 0 && infoindex != upper){
        pbtemp.disabled = false;
        nbtemp.disabled = false;
        temp.innerHTML = infocontents[infoindex];
    }
    else if (infoindex === upper){
        nbtemp.disabled = true;
        temp.innerHTML = infocontents[infoindex];
    }
}    
//used to display the info panel    
function infoPanel(){    
    let iscrn = document.getElementById("screen info");
    if(pause === true && idisable === false){
        iscrn.style.visibility = "hidden";
        pdisable = false;
        hdisable = false;
        pause = false;
        timer();
    } else if (pause === false && idisable === false){
        iscrn.style.visibility = "visible";
        pdisable = true;
        hdisable = true;
        pause = true;
        timer();
    }
}
//Clear contents of divs with id "id" +" "+"number"  
function clearDiv(id,number){
for (let i = 0; i < number; i++){
    let temp = document.getElementById(id +" "+ i);
    temp.innerHTML = "";
}
}
//Called on level complete, clears objects from level before making objects for the next level
function levelComplete(){
    let pltemp = document.getElementById("player");
    let storage = document.createElement('div');
    let maptemp = document.getElementById("map");
    storage.appendChild(pltemp);
    while(player.health < 3){
        healthUp();
    }
    prevscore = score;
    levelWalls = [];
    levelEnemies = [];
    levelSymbols = [];
    levelObstacles = [];
    levelTraps = [];
    levelArrows = [];
    levelHoles = [];
    levelSafeZones = [];
    levelGhosts = [];
    levelTriggers = [];
    arrowIntervals.forEach(clearInterval);
    maptemp.innerHTML = "";
    clearDiv("slot",4);
    levelPopulate();
}
//Pauses the game
function toPause(){
    let pscrn = document.getElementById("screen pause");
    let tempInterval;
    pscrn.innerHTML = "<BR> PAUSE";
    if(pause === true && pdisable === false){
        pscrn.style.visibility = "hidden";
        hdisable = false;
        idisable = false;
        pause = false;
        timer();
        elapsed = 0;
        clearInterval(tempInterval);
    } else if (pause === false && pdisable === false){
        tempInterval = setInterval(function(){
            if (elasped < 999){
                elapsed++;
            } else if (elapsed > 1000){
                elapsed = 0;
            }
            },1);
        pscrn.style.visibility = "visible";
        hdisable = true;
        idisable = true;
        pause = true;
        timer();
    }
}
//Brings up hint dialogue for symbol order
function hintPanel(){
    let hscrn = document.getElementById("screen hint");
    let portrait = document.createElement('div');
    portrait.setAttribute("class","portrait");
    portrait.setAttribute("id","portrait");
    hscrn.appendChild(portrait);
    let temp = document.createElement('div');
    temp.setAttribute("class","dtext");
    temp.setAttribute("id","dtext");
    hscrn.appendChild(temp);
    temp.innerHTML = symbolSet[symbolOffSet[level-1] + 4];
    if(pause === true && hdisable === false){
        hscrn.style.visibility = "hidden";
        pdisable = false;
        idisable = false;
        pause = false;
        timer();
        hscrn.innerHTML = "";
    } else if (pause === false && hdisable === false){
        hscrn.style.visibility = "visible";
        pdisable = true;
        idisable = true;
        pause = true;
        timer();
    }
}
//Creates dialogue that can be triggered to inform the player during gameplay, takes str as a string 
function dialoguePanel(str){
    pdisable = true;
    hdisable = true;
    idisable = true;
    let portrait = document.createElement('div');
    portrait.setAttribute("class","portrait");
    portrait.setAttribute("id","portrait");
    let text = document.createElement('div');
    text.setAttribute("class","dtext");
    text.setAttribute("id","dtext");
    let scrnexit = document.createElement('div');
    scrnexit.setAttribute("class","scrnexit");
    scrnexit.setAttribute("id","scrnexit");
    scrnexit.innerHTML = "X";
    let dscrn = document.getElementById("screen dialogue");
    dscrn.appendChild(portrait);
    text.innerHTML = str;
    dscrn.appendChild(text);
    dscrn.appendChild(scrnexit);
    pause = true;
    timer();
    let xbtn = document.getElementById("scrnexit");
    xbtn.addEventListener("click", function(){ 
        pdisable = false;
        hdisable = false;
        idisable = false;
        pause = false;
        dscrn.style.visibility = "hidden";
        timer();
        dscrn.innerHTML = "";});
    document.addEventListener("keydown",(e) => {
        if (!e.repeat && pause === true && first === true){
            pdisable = false;
            hdisable = false;
            idisable = false;
            pause = false;
            first = false;
            dscrn.style.visibility = "hidden";
            timer();
            dscrn.innerHTML = "";
        }
    });
    dscrn.style.visibility = "visible";
}
//restarts the game, just refreshes the page
function restart(){
    location.reload();
}
//Screen if player loses all health or time runs out
function gameOver(){
    let pscrn = document.createElement('div');
    let target = document.getElementById("screen");
    pscrn.setAttribute("class","screen gameOver");
    pscrn.setAttribute("id","screen gameOver");
    pscrn.innerHTML = "<br>GAME OVER<br>";
    target.appendChild(pscrn);
    let levelre = document.createElement('div');
    levelre.setAttribute("class","levelrestart");
    levelre.setAttribute("id","levelrestart");
    levelre.innerHTML = "LEVEL RESTART";
    pscrn.appendChild(levelre);
    let gamere = document.createElement('div');
    gamere.setAttribute("class","gamerestart");
    gamere.setAttribute("id","gamerestart");
    gamere.innerHTML = "RESTART GAME";
    pscrn.appendChild(gamere);
    let lrebut = addEventListener("mousedown",function(){levelComplete();});
    let grebut = addEventListener("mousedown",function(){restart();});
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
//Congratulation screen after completing the final level
function gameWin(){
    let pscrn = document.createElement('div');
    let target = document.getElementById("screen");
    pscrn.setAttribute("class","screen gameWin");
    pscrn.setAttribute("id","screen gameOver");
    pscrn.innerHTML = "<br>Congratulations!<br>";
    target.appendChild(pscrn);
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
if(!e.repeat && player.move === true){
    if (e.key === "Control" ){
        playerAttack();
    } else if (e.key === "Enter"){
        toPause();
    } else if (e.key === "Shift"){
        playerBlock();
    } else if (e.key === "z"){
        //Testing purposes only!!!
        //levelComplete();
        scoreScreen();
    }
}
})
document.addEventListener("keyup", (e) => {
    if (e.key === "Shift" && player.move === false){
            playerBlock();
        }     
})
/* D-pad functionality*/
const removePressedAll = () => {
   document.querySelectorAll("arrow").forEach(d => {
      d.classList.remove("pressed")
   })
}
document.body.addEventListener("mousedown", () => {
   isPressed = true;
})
document.body.addEventListener("mouseup", () => {
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