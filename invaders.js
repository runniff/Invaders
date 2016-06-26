var canvasWidth = 800;
var canvasHeight = 700;
var stars = new Array(750);
var gun;
var bullet;
var animCount = 0;
var a1 = [];
var a2 = [];
var a3 = [];
var a4 = [];
var a5 = [];
var spaceShip;
var alienDir = "right";
var alienXY = [0.5, 0];
var speedChanged = false;
var level = 1;
var aliensLevel = 1;
//var shoot; 

function start() {
  setupStarField();
  setupGun();
  setupBullet();
  setupHouse();
  setupAliens();
  setupSpaceShip();
  startGame();
  setupSounds();
}

function setupSounds(){
  shoot = new Audio("https://raw.githubusercontent.com/runniff/invaders/upload-sounds/shoot.wav");
  alienExplosion = new Audio("https://raw.githubusercontent.com/runniff/invaders/upload-sounds/invaderkilled.wav");
}

function setupStarField() {
  for (var i = 0; i < stars.length; i++) {
    setupStar(i);
  }
}

function setupGun() {
  gun = new gunData((canvasWidth / 2) - 20);
}

function setupBullet() {
  bullet = new bulletData(gun.x, gun.y, false);
}

function setupHouse() {
  var pos = (canvasWidth / 2) - (105 / 2);
  var vpos = (canvasHeight - 150);

  var h1 = 88;
  var h2 = 265;

  house1 = new houseData(pos - h1, vpos);
  house2 = new houseData(pos - h2, vpos);
  house3 = new houseData(pos + h1, vpos);
  house4 = new houseData(pos + h2, vpos);
}

function setupAliens() {
  var pos = 100;
  var vpos = 300;
  var spacing = 45;

  a1 = [];
  a2 = [];
  a3 = [];
  a4 = [];
  a6 = [];

  for (var a = 0; a < 14; a++) {
    a1.push(new alienThreeData(pos + (a * spacing), vpos - 160, 1, true))
    a2.push(new alienTwoData(pos + (a * spacing), vpos - 120, 1, true))
    a3.push(new alienTwoData(pos + (a * spacing), vpos - 80, 1, true))
    a4.push(new alienOneData(pos + (a * spacing), vpos - 40, 1, true));
    a5.push(new alienOneData(pos + (a * spacing), vpos, 1, true));
  }
}

function setupSpaceShip() {
  spaceShip = new spaceShipData(800);
}

function setupStar(starId) {
  var sc = randomInt(100, 255);
  var starColour = "rgb(" + sc + "," + sc + "," + sc + ")";
  var speed = randomInt(2, 5);
  var size = 1;
  stars[starId] = new star(size, size, canvasWidth, canvasHeight, starColour, speed);
}

function startGame() {
  gameArea.start();
}

var gameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    var gameCanvas = document.getElementById("canvas-placeholder");
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    gameCanvas.insertBefore(this.canvas, gameCanvas.childNodes[0]);
    this.interval = setInterval(updateGameArea, 30);
    window.addEventListener("keydown", function(e) {
      gameArea.key = e.keyCode;
    });
    window.addEventListener("keyup", function(e) { 
      gameArea.key = false;
    });
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function updateGameArea() {
  gameArea.clear();
  drawStars();
  if (gameArea.key && gameArea.key == 37) {
    if (gun.x > 11) {
      gun.x -= 3
    }
  }
  if (gameArea.key && gameArea.key == 39) {
    if (gun.x < 748) {
      gun.x += 3;
    }
  }
  gun.update(gun.x);

  if (gameArea.key && gameArea.key == 17 && bullet.active == false) {
    bullet.x = gun.x + 18;
    bullet.y = gun.y;
    bullet.active = true;
    shoot.play();
  }

  if (bullet.active) {
    bullet.update(bullet.x, bullet.y -= 5);
  }

  house1.update();
  house2.update();
  house3.update();
  house4.update();

  if (animCount > 40) {
    animCount = 0;
  }

  animCount++;
  drawAliens();

  //drawAlienDeath();
  if (spaceShip.x <= -48) {
    spaceShip.x = 800;
  }
  spaceShip.x = spaceShip.x - 3;
  spaceShip.update(spaceShip.x);

  alienCollisionDetection();

  var aliensAlive = countAliveAliens();
  
  
  if (aliensAlive == 0) { 
    alienXY[0] = alienXY[0] * level;
    level = level + 1;
    setupAliens();
  }
  
  if((speedChanged == false) && (aliensAlive == 56 || aliensAlive == 42 || aliensAlive == 28 || aliensAlive == 14)){
    alienXY[0] += 0.5;
    speedChanged = true;
  } 
  
    if(aliensAlive == 55 || aliensAlive == 41 || aliensAlive == 27 || aliensAlive == 13){
    speedChanged = false;
  } 

  debugData();
}

function countAliveAliens(){
  
  var aliveAliens = 0;
  
  var aliens = [a1, a2, a3, a4, a5];

  for (var i = 0; i < aliens.length; i++) {
    var alien = aliens[i];
    for (var a = 0; a < 14; a++) {
      if(alien[a].alive){
        ++aliveAliens;
      }
    }
  }
  return aliveAliens;
}

function drawAlienDeath() {
  var death = new alienDeath(100, 400, true);
  death.update();
}

function drawAliens() {

  var aliens = [a1, a2, a3, a4, a5];
  var dir = alienDirection(aliens);
  

  for (var i = 0; i < aliens.length; i++) {
    var alien = aliens[i];
    for (var a = 0; a < 14; a++) {
      if(alienXY[1] === true){
        alien[a].y = alien[a].y + 10;
      }
      alien[a].update(alien[a].x + dir, alien[a].y);
    }
  }
  alienXY[1] = false;
}

function alienDirection(aliens) {

  var retVal = alienXY[0];

  var r = 764;
  var l = 0;

  for (var i = 0; i < aliens.length; i++) {
    var alien = aliens[i];
    for (var a = 0; a < 14; a++) {

      if (alien[a].alive) {
        if (alienDir == "right") {
          if (alien[a].x >= r) {
            alienDir = "left";
            alienXY[1] = true; 
          }
        } else {
         retVal = alienXY[0] * -1;
          if (alien[a].x <= l) {
            alienDir = "right";
            alienXY[1] = true;
          }
        }

      }
    }
  }
  return retVal;
}

function drawStars() {

  for (var i = 0; i < stars.length; i++) {
    var s = stars[i];
    s.update();
    s.y += s.speed;
  }

}

function star(width, height, x, y, colour, speed) {
  this.width = width;
  this.height = height;
  this.x = randomInt(1, x);
  this.y = randomInt(1, y);
  this.speed = speed;
  this.update = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = colour;
    if (this.y > canvasHeight) {
      this.x = randomInt(1, x);
      this.y = randomInt(1, y);
      this.speed = randomInt(2, 5);
      this.y = 0;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function gunData(x) {
  this.width = 40;
  this.height = 10;
  this.x = x;
  this.y = canvasHeight - 100;
  this.update = function(x) {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,242,242)";
    this.x = x;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillRect(this.x + 2, this.y - 2, this.width - 4, 2);
    ctx.fillRect(this.x + 4, this.y - 4, this.width - 8, 2);
    ctx.fillRect(this.x + 6, this.y - 6, this.width - 12, 2);
    ctx.fillRect(this.x + 17, this.y - 12, this.width - 34, 6);
  }
}

function bulletData(x, y, active) {
  this.width = 4;
  this.height = 8;
  this.x = x + 18;
  this.y = y;
  this.active = active;
  this.update = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,242,242)";
    if (this.y <= 0) {
      this.active = false;
      this.x = gun.x + 18;
      this.y = gun.y;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function alienOneData(x, y, anim, alive) {
  this.x = x;
  this.y = y;
  this.alive = alive;
  this.update = function(x, y) {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,255,0)";

    var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var a1 = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    var a2 = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
    var a3 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var a4 = [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1];;
    var a5 = [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0];
    var a6 = [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0];
    var a7;

    if (animCount < 20) {
      a7 = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
    } else {
      a7 = [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0];
    }

    var aa = [];
    aa = [a7, a6, a5, a3, a4, a3, a2, a1];

    if (!this.alive) {
      aa = [d, d, d, d, d, d, d, d]
    }

    this.x = x;
    this.y = y;
    drawArray(ctx, aa, this.x, this.y)
    if (!this.alive) {
      alienDeath(this.x, this.y);
    }

  }
}

function alienTwoData(x, y, anim, alive) {
  this.x = x;
  this.y = y;
  this.alive = alive;
  this.update = function(x, y) {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,255,0)";

    var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if (animCount < 20) {
      var a1 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      var a2 = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0];
      var a3 = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];
      var a4 = [0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0];
      var a5 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var a6 = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1];
      var a7 = [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1];
      var a8 = [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0];

    } else {
      var a1 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      var a2 = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1];
      var a3 = [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1];
      var a4 = [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1];
      var a5 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var a6 = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
      var a7 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      var a8 = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    }

    var aa = [];

    aa = [a8, a7, a6, a5, a4, a3, a2, a1]

    if (!this.alive) {
      aa = [d, d, d, d, d, d, d, d]
    }

    this.x = x;
    this.y = y;
    drawArray(ctx, aa, this.x, this.y)
    if (!this.alive) {
      alienDeath(this.x, this.y);
    }
  }
}

function alienThreeData(x, y, anim, alive) {
  this.x = x;
  this.y = y;
  this.alive = alive;
  this.update = function(x, y) {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,255,0)";

    var d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    var a1 = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
    var a2 = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0];
    var a3 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0];
    var a4 = [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0];
    var a5 = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];

    if (animCount < 21) {
      var a6 = [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0];
      var a7 = [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0];
      var a8 = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0];
    } else {
      var a6 = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
      var a7 = [0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0];
      var a8 = [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0];
    }

    var aa = [];

    aa = [a8, a7, a6, a5, a4, a3, a2, a1];

    if (!this.alive) {
      aa = [d, d, d, d, d, d, d, d];
    }

    this.x = x;
    this.y = y;
    drawArray(ctx, aa, this.x, this.y)
    if (!this.alive) {
      alienDeath(this.x, this.y);
    }

  }
}

function alienDeath(xPos, yPos) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.update = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,255,0)";

    var d1 = [];
    var d2 = [];
    var d3 = [];
    var d4 = [];
    var d5 = [];
    var d6 = [];
    var d7 = [];
    var d8 = [];

    if (animCount < 2) {
      d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d4 = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0];
      d5 = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];
      d6 = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0];
      d7 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d8 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (animCount >= 2 && animCount < 4) {
      d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d3 = [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0];
      d4 = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];
      d5 = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0];
      d6 = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];
      d7 = [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0];
      d8 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (animCount >= 4 && animCount < 6) {
      d1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d2 = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0];
      d3 = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0];
      d4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d5 = [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0];
      d6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      d7 = [0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0];
      d8 = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0];
    }

    d = [d1, d2, d3, d4, d5, d6, d7, d8];

    var xPos = this.xPos;
    var yPos = this.yPos;

    drawArray(ctx, d, xPos, yPos);
  }
}

function spaceShipData(xPos) {
  this.x = xPos;
  this.y = 80;
  this.update = function(xPos) {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,242,242)";

    var a1 = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    var a2 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
    var a3 = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];
    var a4 = [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0];
    var a5 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var a6 = [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0];
    var a7 = [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];

    var aa = [a7, a6, a5, a4, a3, a2, a1]

    this.x = xPos;
    //this.y = yPos;
    drawArray(ctx, aa, this.x, this.y)
  }
}

function drawArray(ctx, array, xp, yp) {

  var xPos = xp;
  var yPos = yp;
  var tmp
  var size = 3
  for (var i = 0; i < array.length; i++) {
    tmp = array[i];
    for (var a = 0; a < array[i].length; a++) {
      if (tmp[a] === 1) {
        ctx.fillRect(xPos, yPos, size, size);
      }
      xPos = xPos + size;
    }
    xPos = xp;
    yPos = yPos - size;
  }

}

function houseData(startPos, vPos) {
  this.update = function() {
    var ctx = gameArea.context;
    ctx.fillStyle = "rgb(0,242,242)";

    var h1 = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    var h2 = [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0];
    var h3 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0];
    var h4 = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0];
    var h5 = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
    var h6 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var h7 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var h8 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var h9 = [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1];

    var ha = [h9, h9, h9, h9, h9, h9, h9, h8, h7, h6, h6, h5, h4, h3, h2, h1]

    var xPos = startPos;
    var yPos = vPos
    var tmpArray = null;

    for (var h = 0; h < ha.length; h++) {
      tmpArray = ha[h];
      for (var w = 0; w < tmpArray.length; w++) {
        if (tmpArray[w] === 1) {
          ctx.fillRect(xPos, yPos, 4, 4);
        }
        xPos = xPos + 5;
      }
      xPos = startPos;
      yPos = yPos - 4;
    }

  }
}

function alienCollisionDetection() {

  var aliens = [a1, a2, a3, a4, a5];

  for (var a = 0; a < aliens.length; a++) {
    var alien = aliens[a];
    var aw = 36;

    for (var l = 0; l < alien.length; l++) {
      var ca = alien[l];
      var cl = ca.x;

      if (a == 0) {
        aw = 24;
        cl = ca.x + 2;
      }
      if (ca.alive && bullet.active && hitTest(cl, ca.y - 24, aw, 24, bullet.x, bullet.y)) {
        alienExplosion.play();
        ca.alive = false;
        bullet.active = false;
        bullet.y;
      }
    }
  }
}

function hitTest(x1, y1, w1, h1, x2, y2) {
  //x1, y1 = x and y coordinates of object 1
  //w1, h1 = width and height of object 1
  //x2, y2 = x and y coordinates of object 2 (usually midpt)
  if ((x1 <= x2 && x1 + w1 >= x2) &&
    (y1 <= y2 && y1 + h1 >= y2))
    return true;
  else
    return false;
}

function randomInt(minNum, maxNum) {
  return Math.floor(Math.random() * (maxNum - minNum)) + minNum;
}

function debugData() {

  var debugDiv = document.getElementById("debug-data");
  while (debugDiv.firstChild) {
    debugDiv.removeChild(debugDiv.firstChild);
  }
  
  debugElement(debugDiv, ("Gun Pos: " + (gun.x + 18)));
  debugElement(debugDiv, "Bullet Pos: (x): " + bullet.x + " (y): " + bullet.y);
  debugElement(debugDiv, ("Spaceship Pos: (x): " + (spaceShip.x)));
  debugElement(debugDiv, "Aliens alive: " + countAliveAliens());     
  debugElement(debugDiv, "Alien Speed: " + alienXY[0]);
  debugElement(debugDiv, "Alien Height: " + alienXY[1]);
}

function debugElement(debugDiv, data){
  var p = document.createElement("p");
  var t = document.createTextNode(data);
  p.appendChild(t);
  debugDiv.appendChild(p);
}
