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
standing=false
const sprite = new Image();
sprite.src = "black.png";
const grav = 0.4;      //sets gravitational acceleration
var background = true;       // TRUE is BLACK, FALSE is WHITE
var platforms = [];
var controls = {
    left: false,
    right: false,
};
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
        this.inAir=false
        this.landHard=false
        this.scaleH=1;
    }
    update() {
        if(standing){if(this.inAir){this.velY=0; this.inAir=false}}

        if (frames*1.5 % 10>=0&&frames*1.5 % 10<=1) {
            if(this.velY>0 && this.inAir){if(this.frame<25){this.frame++}if(this.frame<19){this.frame=19} else{this.landHard=true}}
    
            if(this.velY<0 && this.inAir){if(this.frame<18){this.frame++}if(this.frame<16){this.frame=16}}
           
            if(this.velY=0||!this.InAir){    
            if(controls.right||controls.left){this.frame=this.frame%12+4; if(this.frame<6){this.frame=6};
            if(controls.left){this.scaleH=-1}
            if(controls.right){this.scaleH=1}
            }
                else{this.frame++;this.frame=this.frame % 5;  if(this.landHard){console.log("landing");this.frame=26; this.landHard=false;}}
            }
        }

        

        // LOAD SPRITE IMAGE
        sprite.src = background ? "white.png" : "black.png"
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
        console.log("HEYYYY")
            this.x -= this.velX;}
            
        if (controls.right){
            console.log("HOOOOO")
            this.x += this.velX;
        }
        //---------------
      
        

    };
    draw()
    { 
        ctx.drawImage
        (sprite, animation[this.frame].sX, animation[this.frame].sY, 160, 160,
        this.x-myCam.x, this.y, this.width, this.height);

    }
    flip(scaleH)
    {
        ctx.save(); // Save the current state
        ctx.scale(scaleH, 0); // Set scale to flip the image
        ctx.drawImage
        (sprite, animation[this.frame].sX, animation[this.frame].sY, 160, 160,
        this.x, this.y, this.width, this.height);
        ctx.restore(); // Restore the last saved state
    }
    jump(){
        this.velY=-16
        console.log("HI")
        this.frame=2
        this.inAir=true;
    }
}
//------------------------------------------------------------
//OBJECT PLAYER's CHAR
//--------------------------------------------------------------------------
var myChar = new Character(cvs.width/2-100, cvs.height/2-100, cvs.width/10, cvs.width/10);

//--------------------------------------------------------------------------

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
        ctx.strokeStyle = ((this.color)?'black':'white');
        ctx.lineWidth=5;
        ctx.beginPath();
       ctx.rect(this.x-myCam.x,this.y,this.w,this.h);
       ctx.stroke();

    }

    update()
    {
        
        if(
            myChar.y+myChar.height>=platforms[i].y 
            && myChar.y+myChar.height<=platforms[i].y+platforms[i].h 

            &&platforms[i].color!=background 
            &&myChar.x+myChar.width*0.72  >=platforms[i].x
            && myChar.x+myChar.width*0.28 <=platforms[i].x+platforms[i].w) 
            {standing=true}
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
    myChar.draw()
    myChar.flip(myChar.scaleH)
}

function updateAll()
{
    myCam.update()
    bg.update()
    standing=false
    for(i=0;i<platforms.length;i++)
    {
        platforms[i].update()
    }
    myChar.update()
}


drawAll()
updateAll()


var down=true;
window.addEventListener("keydown", function (e) {
    switch (e.keyCode) {
        case 37: // left arrow
            controls.left = true;
            break;
        case 39: // right arrow
            controls.right = true;
            break;
        case 32: //space bar
            if(down){return;}
            down=true
            if(!myChar.inAir)
            {myChar.jump()
            fwip.currentTime=0;
            fwip.play()}
            break;
        case 20: // caps lock
            if(down){return;}
            down=true
            background =((background) ? false : true);
            light.currentTime=0;
            light.play()
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
        case 20: //Caps lock
        down=false
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

platforms.push(new Platform(true,600,600,300,50))
platforms.push(new Platform(true,200,800,200,50))
platforms.push(new Platform(true,1100,200,250,50))

mainLoop()