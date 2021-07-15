var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");

canvas.width = innerWidth; 
canvas.height = innerHeight;

let mouse = {
    x: canvas.width/2,
    y:canvas.height/2
}

let enemyArray = [];


class Enemy {
    constructor(x, y, radius, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;

        this.update = function () {

            if (this.x + this.radius < 0 || this.x - this.radius > canvas.width || this.y - this.radius > canvas.height || this.y + this.radius < 0 ) {
                enemyArray.splice(i, 1)
            }

            for (let j = 0; j < missileArray.length; j++) {
                const dist = Math.hypot(missileArray[j].x - this.x, missileArray[j].y - this.y)
                if (dist <= this.radius + missileArray[j].radius) {
                    missileArray.splice(j, 1);
                    enemyArray.splice(i, 1)
                }
            }

            

            this.x += this.vx;
            this.y += this.vy;

            this.draw();
        };
        this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
            ctx.closePath();
        };
    }
}

let missileArray = [];

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height

        this.update = function () {
            ctx.save();
            getangle(this.x, this.y);
            
            // Rotation
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);  
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height /2));
    
            this.rotation = getangle(this.x, this.y, this.width, this.height)
            ctx.fillStyle = "white"
            ctx.fillRect(this.x, this.y, this.width, this.height);  
            ctx.restore()
            
        };

        this.shoot = function () {

            let angle = Math.atan2((mouse.y-this.y), (mouse.x-this.x))
            let vx = Math.cos(angle) * 3 * (1+chargemeter/25)
            let vy = Math.sin(angle) * 3 * (1+chargemeter/25)
            
            missileArray.push(new Missile(this.x, this.y, vx, vy, angle))
        };
    }
}

class Missile {
    constructor(x, y, vx, vy, width, height) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = 10;

        this.update = function () {
            
            if (this.x + this.radius <= 0 || this.x - this.radius >= canvas.width || this.y - this.radius >= canvas.height || this.y + this.radius <= 0 ) {
                missileArray.splice(i, 1)
            }
            
            this.x += this.vx;
            this.y += this.vy;

            this.draw();
        };

        this.draw = function () {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath();
        };
    }
}

class Floor {
    constructor(x, y, width, height, ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.update = function () {

            this.draw();
        };

        this.draw = function () {
            
            ctx.fillStyle = "#755236"
            ctx.fillRect(this.x, this.y, this.width, this.height)
        };
    }
}

function getangle(x1, y1, width, height) {
    const center = {
        x: x1+width/2,
        y: y1+height/2
    }
    const diffx = mouse.x - center.x;
    const diffy = mouse.y - center.y;
    
    let angle = Math.atan2((diffy), (diffx));
    console.log(angle)

    return angle;
    
}

let mousestilldown = false;

canvas.addEventListener("mousedown", function () {
    mousestilldown = true;
    charge();
})

canvas.addEventListener("mouseup", function () {
    mousestilldown = false;
    for (i = 0; i < playerArray.length; i++) {
        playerArray[i].shoot()
    }
    chargemeter = 1;
})

window.addEventListener("mousemove", event =>{
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

function getDistance(x1, y1, x2, y2) {
    let distanceX = x1 - x2;
    let distanceY = y1 - y2;

    return Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
}

let playerArray = [];

playerArray.push(new Player(canvas.width*0.25, canvas.height-100, 80, 20));
playerArray.push(new Player(canvas.width*0.75, canvas.height-100, 80, 20));

function spawn () {
    setInterval(function () {

        const radius = Math.random() * 40 + 10;
        
        let randomizer = Math.random();
        let randomizer2 = Math.random();

        if (randomizer >= 0.3) {
            x = Math.random() * canvas.width;
            y = -radius;
            vx = (Math.random()-0.5) * 3
        }
        else {
            y = Math.random() * canvas.height/3
            if (randomizer2 > 0.5) {
                x = -radius
                vx = Math.random() * 4.5 + 0.5;
            }
            else {
                x = canvas.width + radius
                vx = -(Math.random() * 4.5) - 0.5
            }
        }
        vy = (Math.random()-0.5) * 1.5 + 0.9


        enemyArray.push(new Enemy(x, y, radius, vx, vy))
    }, 1000)
};

let chargemeter = 1;

function charge () {
    if (mousestilldown) {requestAnimationFrame(charge)}

    for (let f = 0; f < playerArray.length; f++) {
        ctx.strokeStyle = "darkgray"
        ctx.strokeRect(playerArray[f].x - 60, playerArray[f].y - 60, 120, 30);

        ctx.fillStyle = "orange"
        if (chargemeter < 236) {
            chargemeter += 0.35;
            ctx.fillStyle = "yellow"
        }
        
        ctx.fillRect(playerArray[f].x - 60 + 1, playerArray[f].y - 60 + 1, chargemeter/2, 28)
        ctx.fillStyle = "brown"
    }   
}

let floorArray = []

function drawFloor() {
    for (let t = 0; t < enemyArray.length; t++) {
        let bw = 50;
        let bh = 100;
        let count = 0;
        for (i = -canvas.width/bw/2; i < canvas.width/bw/2; i ++) {
            ctx.fillStyle = "#5E9D34"
            bh += ((i)^5)/2

            ctx.fillRect(count * bw, canvas.height - bh * 3, bw, bh * 3)

            
                if (enemyArray[t].y + enemyArray[t].radius >=  canvas.height - bh * 3 && Math.sqrt((enemyArray[t].x + enemyArray[t].radius - count * bw)^2) <= 3) {
                    enemyArray.splice(t, 1);
                    ctx.fillStyle = "red"
                    ctx.fillRect(0, 0, canvas.width, canvas.height, );
                }
            

            count++;
        }
    }
}

let bw = 50;
let bh = 100;
let count = 0;

for (i = -canvas.width/bw/2; i < canvas.width/bw/2; i ++) {
    bh += ((i)^5)/2
    ctx.fillStyle = "#5E9D34"
    floorArray.push(new Floor(count * bw, canvas.height - bh * 3 + 30, bw, bh * 3))
    count++;
}

let stars = setInterval(star, 200);

function star() {
    ctx.fillStyle="#ffffed";

    ctx.beginPath();
    ctx.arc(Math.random()*canvas.width, Math.random()*canvas.height/1.5, Math.random()*2, 0, 2*Math.PI);
    ctx.fill();
    ctx.closePath();
}


function animate () {
    requestAnimationFrame(animate);
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0,0.1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height, );
    
    drawFloor()
    
    for (i = 0; i < floorArray.length; i++) {
        floorArray[i].update()
    }
    for (i = 0; i < playerArray.length; i++) {
        playerArray[i].update()
    }
    for (i = 0; i < enemyArray.length; i++) {
        enemyArray[i].update()
    }
    for (i = 0; i < missileArray.length; i++) {
        missileArray[i].update()
    }
}
spawn();
requestAnimationFrame(animate);
