var flower = document.createElement("audio");
flower.setAttribute("src", "flower.mp3");
flower.volume=0.02
var fwip = document.createElement("audio");
fwip.setAttribute("src", "fwip.mp3");
fwip.volume=0.1
var light = document.createElement("audio");
light.setAttribute("src", "lighter.mp3");
light.volume=0.1


//DEFINE CANVAS AND CONTEXT
//-------------------------------------------------------------------------
var cvs = document.getElementById('gamecvs');
//sets a variable which calls the game canvas/container
var ctx = cvs.getContext('2d');
//allows the 2d image variant to be drawn on the canvas
//--------------------------------------------------------------------------
ctx.fillRect(0,0,10,10);
//FRAMERATE EDITING VARIABLES
//--------------------------------------------------------------------------
lastFrameTimeMs = 0,
    maxFPS = 100,
    delta = 0,
    timestep = 1000 / maxFPS,
    framesThisSecond = 0,
    lastFpsUpdate = 0;
//--------------------------------------------------------------------------
//DEFINE GLOBAL VARIABLES
//--------------------------------------------------------------------------
const sprite = new Image();
sprite.src = "black.png";
const grav = 0.4;      //sets gravitational acceleration
var background = true;       // TRUE is BLACK, FALSE is WHITE
var platforms = [];
var walls = [];
var controls = {
    left: false,
    right: false,
};
level_number=0;
var frames=0
var map = 
    {
        width:3000, 
        height:1000
    }
var animation = [
    {sX: 0, sY : 0},
    {sX: 0, sY : 0},
    {sX: 160, sY : 0},
    {sX: 320, sY : 0},
    {sX: 320, sY : 0},
    {sX: 480, sY : 0},
    {sX: 480, sY : 0},
    {sX: 640, sY : 0},
    {sX: 0, sY : 160},
    {sX: 160, sY : 160},
    {sX: 320, sY : 160},
    {sX: 320, sY : 160},
    {sX: 480, sY : 160},
    {sX: 640, sY : 160},
    {sX: 0, sY : 320},
    {sX: 160, sY : 320},
    {sX: 320, sY : 320},
    {sX: 480, sY : 320},
    {sX: 640, sY : 320},
    {sX: 0, sY : 480},
    {sX: 160, sY : 480},
    {sX: 320, sY : 480},
    {sX: 480, sY : 480},
    {sX: 640, sY : 480},
    {sX: 0, sY : 640},
    {sX: 160, sY : 640},
    {sX: 320, sY : 640},
]

var edgex=null;
var edgew=null;

var bg =
{
    draw: function () {
        ctx.fillRect(0, 0, map.width, map.height);
    },

    update: function(){
        ctx.fillStyle = ((background) ? "black" : "white");
    }
}

//CHARACTER CLASS
//-----------------
class Character {
    constructor(x,y,w,h) {
        this.x=x
        this.y=y
        this.width=w
        this.height=h
        this.velX = 5;
        this.velY = 0;
        this.frame=0
        this.inAir=true
        this.landHard=false
        this.right=true;
    }
    update() {
        if(myChar.x+myChar.width*0.72  <edgex
            || myChar.x+myChar.width*0.28 >edgex+edgew) 
            {myChar.inAir=true}

        if (frames*1.5 % 10>=0&&frames*1.5 % 10<=1) {
            if(this.velY>0 && this.inAir){if(this.frame<25){this.frame++}if(this.frame<19){this.frame=19} else{this.landHard=true}}
    
            if(this.velY<0 && this.inAir){if(this.frame<18){this.frame++}if(this.frame<16){this.frame=16}}
           
            if(this.velY==0){    
                
                if(controls.right||controls.left){this.frame=this.frame%12+4; if(this.frame<5){this.frame=5};
            }
                else{this.frame++;this.frame=this.frame % 5;  if(this.landHard){console.log("landing");this.frame=26; this.landHard=false;}}
            }
        }

        

        // LOAD SPRITE IMAGE
        if(this.right){sprite.src =(background ? "white.png" : "black.png")}
        if(!this.right){sprite.src =(background ? "rewhite.png" : "reblack.png")}
        
       if(this.inAir){this.velY += grav; this.y += this.velY;}
       //=====================================================================


       //OUTOFBOUNDS-------------------------------------
        if (this.x< 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x + this.width / 2 > map.width) { 
            this.x = map.width - this.width / 2;
        }
        if (this.y + this.height >= cvs.height) {
            this.y = map.height - this.height;
            if(this.inAir){this.velY=0}
            this.inAir=false;
        }

        
        //X MOVEMENT-----------------------------------------------
        if (controls.left){
            this.x -= this.velX;}
            
        if (controls.right){
            this.x += this.velX;
        }
        //---------------

    };
    draw()
    { 
        
        ctx.drawImage(sprite, animation[this.frame].sX, animation[this.frame].sY, 160, 160,
        this.x-myCam.x, this.y, this.width, this.height);

    }
    jump(){
        this.velY=-16
        this.frame=2
        this.inAir=true;
        // this.y-=
    }
}
//------------------------------------------------------------
//OBJECT PLAYER's CHAR
//--------------------------------------------------------------------------
var myChar = new Character(cvs.width/2-100, cvs.height/2-100, cvs.width/10, cvs.width/10);

//--------------------------------------------------------------------------
class Wall{
    constructor(color, x,y,w,h){ 
        this.color=color;
        this.w=w
        this.h=h
        this.x=x
        this.y=y
    }
    draw()
    {
        ctx.fillStyle = ((this.color==1)?"grey":((this.color==2)?'black':'white'));
        ctx.fillRect(this.x-myCam.x,this.y,this.w,this.h);
    }
    update()
    {
        if(
            myChar.y+myChar.height>=walls[i].y 
            && myChar.y+myChar.height<=walls[i].y+walls[i].h
            &&myChar.x+myChar.width*0.72  >=walls[i].x
            && myChar.x+myChar.width*0.28 <=walls[i].x+walls[i].w
            &&walls[i].color!=((background)?2:0) 
            ) 
            {
                console.log("touching")
                if (!myChar.right){
                    myChar.x += 2*myChar.velX;}
                else{
                    myChar.x -= 2*myChar.velX;
                }
                
            }                
    }
}



class Platform{
    constructor(color, x,y,w,h){ 
        this.color=color;
        this.w=w
        this.h=h
        this.x=x
        this.y=y
    }
    draw()
    {
        ctx.fillStyle = ((this.color==1)?"grey":((this.color==2)?'black':'white'));
       ctx.fillRect(this.x-myCam.x,this.y,this.w,this.h);
    }
    update()
    {
        // (0 = BLACK, 1 = GRAY, 2 = WHITE)
        if(
            myChar.y+myChar.height>=platforms[i].y 
            && myChar.y+myChar.height<=platforms[i].y+platforms[i].h
            && myChar.velY>=0
            &&platforms[i].color!=((background)?2:0) 
            ) 
            {
                console.log("touching")
            if(myChar.x+myChar.width*0.72  >=platforms[i].x
                && myChar.x+myChar.width*0.28 <=platforms[i].x+platforms[i].w) 
                {edgex=platforms[i].x; edgew=platforms[i].w;if(myChar.inAir=true){myChar.velY=0}; myChar.inAir=false; myChar.y=platforms[i].y-myChar.height-1}
                else{
                    console.log("overair");
                    myChar.inAir=true;}
            }  
                    
            
    }
    
    
}


class endPlat{
    constructor(x,y,w,h){ 
        this.w=w
        this.h=h
        this.x=x
        this.y=y
    }
    draw()
    {
        ctx.fillStyle = red;
       ctx.fillRect(this.x-myCam.x,this.y,this.w,this.h);
    }
    update()
    {
        if(
            myChar.y+myChar.height>=this.y 
            && myChar.y+myChar.height<=this[i].y+this[i].h
            && myChar.x+myChar.width*0.72  >=this[i].x
            && myChar.x+myChar.width*0.28 <=this[i].x+this[i].w)  
            {
                console.log("touching")
                myChar.inAir=true;}
                myChar.x=100;
                myChar.y=100;
                myCam.x=0;
                lvlCreate(levels[level_number++]);
            }
                          
            
    }
    

//CAMERA CLASS
//----------------------------------------------------------------------
class Camera
{
    constructor()
    {    this.x=0;
        this.y=0;
        this.w=cvs.width;
        this.h=cvs.height;
        this.tempx=0
    }
    update()
    {
        this.tempx=myChar.x-this.w/2-myChar.width/2
        if(this.tempx<0 || this.tempx+this.width>map.width)
        {return;}
        else{this.x=this.tempx}
    }    

}

//----------------------------------------------------------------------
var myCam = new Camera();

function drawAll()
{
    ctx.clearRect(0,0,cvs.width,cvs.height)
    bg.draw()
    for(i=0;i<platforms.length;i++)
    {platforms[i].draw()}
     for(i=0;i<walls.length;i++)
   {walls[i].draw()}
    myChar.draw()
    
}

function updateAll()
{
    myCam.update()
    bg.update()
    for(i=0;i<platforms.length;i++)
    {platforms[i].update()}
    for(i=0;i<walls.length;i++)
    {walls[i].update()}
    myChar.update()
}


drawAll()
updateAll()


var down=true;
var down2=true;
window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = true;
            myChar.right=false
            break;
        case 39: // right arrow
            controls.right = true;
            myChar.right=true
            break;
        case 32: //space bar
            if(down){return;}
            down=true
            if(!myChar.inAir)
            {myChar.jump()
            fwip.currentTime=0;
            fwip.play()}
            break;
        case 13: // enter
            if(down2){return;}
            down2=true
            background = !background;
            light.currentTime=0;
            light.play()
            myChar.inAir=true;
            break;
        case 20: // enter
            if(down2){return;}
            down2=true
            background = !background;
            light.currentTime=0;
            light.play()
            myChar.inAir=true;
            break;
    }
}, false);

window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = false;
            break;
        case 39: // right arrow
            controls.right = false;
            break;
        case 32: //space bar
            down=false
            break;
        case 13: //enter
        down2=false
        break;
        case 20: //enter
        down2=false
        break;

    }
}, false);

window.addEventListener("keyup", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = false;
            break;
        case 39: // right arrow
            controls.right = false;
            break;
        case 32: //space bar
            down=false
            break;
        case 13: //enter
        down2=false
        break;

    }
}, false);

var running = false,
    started = false;

function stop() {
    running = false;
    started = false;
    cancelAnimationFrame(frameID);
}

function start() {
    if (!started) {
        started = true;
        frameID = requestAnimationFrame(function (timestamp) {
            drawAll();
            running = true;
            lastFrameTimeMs = timestamp;
            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
            frameID = requestAnimationFrame(mainLoop);
        });
    }
}

function mainLoop(timestamp) {
    flower.play()
    if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        frameID = requestAnimationFrame(mainLoop);
        return;
    }
    delta += timestamp - lastFrameTimeMs;
    lastFrameTimeMs = timestamp;
    while (delta >= timestep) {
        drawAll()
        updateAll(timestep);
        }
        delta -= timestep;
        frames++;
        drawAll()
        updateAll(timestep);
    frameID = requestAnimationFrame(mainLoop);
}
// walls.push(new Wall(0,500,500,300,50))
// platforms.push(new Platform(0,600,600,300,50))
// platforms.push(new Platform(2,200,800,200,50))
// platforms.push(new Platform(2,1100,400,250,50))
// platforms.push(new Platform(1,1500,600,300,50))

var level1 = {
    platforms: [
        {color: 0,x: 600,y: 600, width: 300, height: 50},
        {color: 2,x: 200,y: 800, width: 200, height: 50},
        {color: 2,x: 1100,y: 400, width: 250, height: 50},
        {color: 1,x: 1500,y: 600, width: 300, height: 50},
        {color: 1,x: 0, y: 10000, width: 1800, height: 100},
    ],
    walls: [
        {color: 0,x: 500,y: 600, width: 30, height: 400},
    ],
}
var level2 = {
    platforms: [
        // {color: 0,x: ,y: 600, width: 300, height: 50},
    ],
    walls: [
        // {color: 0,x: 500,y: 600, width: 30, height: 400},
    ],
}
var level3 = {
    platforms: [
        // 0 = BLACK, 1 = GRAY, 2 = WHITE
        {color: 1,x:  100*3,y: 100*3, width: 100*3, height: 20*3},  //10, 10, 10, 2
        {color: 0,x:  250*3,y: 100*3, width:  70*3, height: 20*3},  //25, 10, 7, 2
        {color: 0,x:  370*3,y: 100*3, width:  70*3, height: 20*3},  //37, 10, 7, 2
        {color: 0,x:  490*3,y: 150*3, width:  70*3, height: 20*3},  //49, 15, 7, 2
        {color: 0,x:  610*3,y: 120*3, width:  70*3, height: 20*3},  //61, 12, 7, 2
        {color: 0,x:  710*3,y: 130*3, width:  70*3, height: 20*3},  //71, 13, 7, 2
        {color: 1,x:  0*3,y: 200*3, width: 750*3, height: 50*3},  //0, 20, 75, 5
        {color: 1,x:  800*3,y: 130*3, width: 300*3, height: 20*3},  //80, 13, 30, 2
        {color: 1,x: 800*3,y: 30*3, width: 300*3, height: 20*3},  //80, 3, 30, 2
        {color: 0,x: 1200*3,y: 150*3, width: 200*3, height: 70*3},  //120, 15, 20, 7
        {color: 1,x: 1500*3,y: 150*3, width: 200*3, height: 70*3},  //150, 15, 20, 7
        {color: 2,x: 1800*3,y: 150*3, width: 200*3, height: 70*3},  //180, 15, 20, 7
        {color: 2,x: 1800*3,y: 1000*3, width: 400*3, height: 100*3},  //180, 100, 40, 10
        {color: 2,x: 1700*3,y: 1000*3, width: 100*3, height: 150*3},  //170, 100, 10, 15
        {color: 0,x: 1400*3,y: 1050*3, width: 100*3, height: 150*3},  //140, 105, 10, 15
        {color: 0,x: 1030*3,y: 1000*3, width: 200*3, height: 150*3},  //103, 100, 20, 15
        {color: 0,x: 900*3,y: 1200*3, width: 150*3, height: 100*3},  //90, 120, 15, 10
        {color: 1,x: 950*3,y: 1070*3, width: 100*3, height: 50*3},  //95, 107, 10, 5
        {color: 1,x: 660*3,y: 1000*3, width: 240*3, height: 150*3},  //66, 100, 24, 15
        {color: 1,x: 100*3,y: 1000*3, width: 150*3, height: 100*3},  //10, 100, 15, 10
        {color: 2,x: 250*3,y: 1000*3, width: 410*3, height: 100*3},  //25, 100, 41, 10
        {color: 1,x: 10*30,y: 130*30, width: 41*30, height: 10*30},  //10, 130, 41, 10
        {color: 1,x: 51*30,y: 130*30, width: 15*30, height: 10*30},  //51, 130, 15, 10
        {color: 0,x: 51*30,y: 130*30, width: 15*30, height: 10*30},  //51, 130, 15, 10
        {color: 0,x: 10*30,y: 150*30, width: 15*30, height: 10*30},  //10, 150, 15, 10
        {color: 2,x: 25*30,y: 150*30, width: 41*30, height: 10*30},  //25, 150, 41, 10
        {color: 1,x: 25*30,y: 150*30, width: 41*30, height: 10*30},  //25, 150, 41, 10
        {color: 1,x: 7*30,y:175*30, width: 15*30, height: 10*30},
           
    ],
    walls: [
        {color: 0,x: 910*3,y: 50*3, width: 30*3, height: 80*3},  //91, 5, 3, 8
        {color: 2,x: 1070*3,y: 50*3, width: 300*3, height: 80*3},  //107, 5, 3, 8
        {color: 2,x: 2500*3,y: 50*3, width: 100*3, height: 500*3},  //250, 5, 10, 50
        {color: 0,x: 1030*3,y: 1000*3, width: 50*3, height: 200*3},  //103, 100, 5, 20
        {color: 2,x: 850*3,y: 1000*3, width: 50*3, height: 200*3},  //85, 100, 5, 20
        {color: 1,x: 0*3,y: 250*3, width: 100*3, height: 1750*3},    //0, 25, 10, 175
        {color: 1,x: 660*3,y: 1150*3, width: 100*3, height: 850*3},  //66, 115, 10, 85
    ],
}

function lvlCreate(level){
    platforms=[];
    for(i=0;i<level.platforms.length;i++){
        platforms.push(new Platform(level.platforms[i].color,level.platforms[i].x,level.platforms[i].y,level.platforms[i].width,level.platforms[i].height));
    }
    walls=[];
    for(i=0;i<level.walls.length;i++){
        walls.push(new Wall(level.walls[i].color,level.walls[i].x,level.walls[i].y,level.walls[i].width,level.walls[i].height));
    }
}
levels=[level1, level2, level3];
lvlCreate(levels[level_number]);
mainLoop()