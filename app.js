const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

// Get images
const canoe = new Image();

// Timers
let timerId, introTimer, retryTimer;

// Background, Images
const grdTop = ctx.createLinearGradient(0, 245, 800, -500);

grdTop.addColorStop(0,"#FFB210");
grdTop.addColorStop(0.13,"#fff");
grdTop.addColorStop(0.3,"#64d2f6");
grdTop.addColorStop(1,"#fff");

const grdBottom = ctx.createLinearGradient(0, 245, 0, 450);

grdBottom.addColorStop(0,"#5DC9D4");
grdBottom.addColorStop(1,"#3066b5");

canoe.src = "ship.png";

// Variables
var canoeX = 200, canoeY = 200;
var gravity = 0.3;
const canoeWidth = 60, canoeHeight = 60;
let yVector = 0;
let base = 200;
var drawY = 0;

// For row
let rowRange = 0;
var friction = 0.004;

// Status
let status = {
  stay: true,
  left: false,
  right: false,
  jump: false,
  dive: false,
  row: false
}

// Progress
var progress = 0;

// Obstacle
var obs = {
  width: 50,
  height: 260,
  gap: 344,
  bottomBase: 200
}
var obsArr = [];

// Reset
function reset() {
  canoeX = 200; canoeY = 200; progress = 0; rowRange = 0; yVector = 0; gravity = 0.3; score = 0;
  status = {stay: true, left: false, right: false, jump: false, dive: false, row: false};
  for (let i = 0; i < 4; i++) {
    obsArr[i].x = cvs.width + (obs.gap * i);
    obsArr[i].y = drawY;
    obsArr[i].z = Math.floor(Math.random() * 2);
    paperArr[i].x = cvs.width + (obs.gap * i) + paperSize;
    paperArr[i].y = drawY + paperHeight;
  };
}

// Key down event
function keyDown(e) {

  // Up
  if(e.keyCode === 38){
    if(status.stay && !status.jump){
    yVector= -9;
    status.jump = true;
    }
  }

  // Dive
    if(e.keyCode === 40){
      if(!status.dive && !status.jump){
      yVector= 1;
      status.stay = false;
      status.dive = true;
    }
  }
}

// Key up event
function keyUp(e) {

  // Dive
  if(e.keyCode === 40){
    status.dive = false;
    yVector= 2;
  }

  // Row
  if(e.keyCode === 82 && introTimer === false) {
    status.row = true;
    rowRange = 3.5;
  }

  // Start game
  if(e.keyCode === 32 && introTimer !== false) {
    clearInterval(introTimer);
    introTimer = false;
    timerId = setInterval(loop, 11);
  }

  // Retry game
  if(e.keyCode === 32 && timerId === false) {
    reset();
    timerId = setInterval(loop, 11);
  }
}


// Obstacles coordinates
for (let i = 0; i < 4; i++) {
  obsArr.push({
    x: cvs.width + (obs.gap * i),
    y: drawY,
    z: Math.floor(Math.random() * 2)
  })
}
// Paper
var paperHeight = 75;
const paperSize = 20;

var paperArr = [];
for (let i = 0; i < 4; i++) {
  paperArr.push({
    x: cvs.width + (obs.gap * i) + paperSize,
    y: drawY + paperHeight,
  })
}


// Obstacles
function drawObs(i) {
  if(obsArr[i].z === 0 ) {
    ctx.fillStyle = '#75eccb';
    obsArr[i].y = 0;
  } else {
    ctx.fillStyle = '#5598db';
    obsArr[i].y = 200;
  }
  ctx.fillRect(obsArr[i].x, obsArr[i].y, obs.width, obs.height);
}

function drawPaper(i){
  if(paperArr[i].y === 1000){
  } else {
    if(obsArr[i].z === 0) {
      paperArr[i].y = obs.height + paperHeight;
    } else {
      paperArr[i].y = 200 - paperHeight;
    }
  }
  ctx.font = paperSize + "px serif";
  ctx.fillText('📜', paperArr[i].x, paperArr[i].y);
}

 // Progress bar
function drawProgress(proX) {
  ctx.moveTo(40, 50);
  ctx.lineTo(220, 50);
  ctx.globalAlpha = "0.4";
  ctx.strokeStyle = "#179770";
  ctx.lineWidth = "5";
  ctx.stroke();
  ctx.globalAlpha = "1.0";

  // Mini canoe
  ctx.drawImage(canoe, 30 + proX, 35, 25, 25);
  ctx.font = "15px serif"
  ctx.fillText('🎯', 218, 55);
}

// Score
var score = 0;
function drawScore() {
  ctx.fillStyle = "#000000";
  ctx.fillText( score + '/10', 40 , 30);
}

// Retry
function retry() {
  ctx.fillStyle = "#000000"
  ctx.globalAlpha = "0.4";
  ctx.fillRect(0, 0, 800, 450);
  ctx.globalAlpha = "1.0";

  ctx.font = "bolder 50px cursive";
  ctx.fillStyle = '#fff';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Press [SPACEBAR] to Retry", cvs.width/2, cvs.height/2);
}

// Loop
function loop() {
  ctx.fillStyle = grdTop;
  ctx.fillRect(0, 0, 800, 245);

  ctx.fillStyle = grdBottom;
  ctx.fillRect(0, 245, 800, 205);

  // Jump
  if(status.jump) {
    yVector += gravity;
    canoeY += yVector;
    status.stay = false;
    if(canoeY > base) {
      status.jump = false;
      status.stay = true;
      canoeY = base;
    }
  }

  // Dive
  if(status.dive === true) {
    canoeY += yVector;
    if(canoeY > 400) {
      yVector = 0;
    }
  } else if(!status.dive && !status.stay && !status.jump){
    canoeY -= yVector;
    if(canoeY < base) {
      yVector = 0;
      status.stay = true;
    }
  }
  // Draw Obstacles AND Paper
  for (let i = 0; i < obsArr.length; i++) {
    drawObs(i);
    drawPaper(i);

    // Rowing forward
    if(!status.row) {
      obsArr[i].x -= 0.5;
      paperArr[i].x -= 0.5;
      progress += 0.5 / 100;
    }

    if(status.row) {
      obsArr[i].x -= rowRange;
      paperArr[i].x -= rowRange;
      rowRange -= friction;
      if(rowRange <= 0.5) {
        status.row = false;
      }
      progress += rowRange / 100;
    }

    // Obstacle, Paper merry go round
    if(obsArr[i].x <= 0 - obs.width) {
      obsArr[i].x = obs.gap * 4 - obs.width;
      obsArr[i].z = Math.floor(Math.random() * 2);
      paperArr[i].x = obs.gap * 4 - paperSize - 10;
      paperArr[i].y = 0;
    }

    // Collect paper
    if(paperArr[i].y <= canoeY + canoeHeight && canoeY <= paperArr[i].y &&
      paperArr[i].x <= canoeX + canoeWidth && canoeX <= paperArr[i].x)
      {
        paperArr[i].y = 1000;
        score++;
    }

    if(obsArr[i].y + 10<= canoeY + canoeHeight && canoeY <= obsArr[i].y + obs.height -10 && 
      obsArr[i].x <= canoeX + canoeWidth && canoeX <= obsArr[i].x + obs.width){
        clearInterval(timerId);
        timerId = false;
      }


  }
  drawProgress(progress);
  drawScore();
  ctx.drawImage(canoe, canoeX, canoeY, canoeWidth, canoeHeight);
  
  if(!timerId) {setTimeout(retry(), 100)};
}

// Intro loop
function introLoop() {
  ctx.fillStyle = "#BB8456";
  ctx.fillRect(0, 0, 800, 450);
  
  // Title
  ctx.font = "bolder 44px monospace";
  ctx.fillStyle = '#660A00';
  ctx.textAlign = "center";
  ctx.fillText("Stolen Page", cvs.width/2, 100);

  // Story
  ctx.font = "italic 24px cursive";
  ctx.fillStyle = '#660A00';
  ctx.fillText("According to legend, a page of our island's book was stolen", cvs.width/2, 175);
  ctx.fillText("It was 404th page about 'happiness', why we couldn't see the page", cvs.width/2, 210);
  ctx.fillText("Rumor says that the page was torn and sunk into the sea", cvs.width/2, 245);
  ctx.fillText("I'll find it and bring it to the island!", cvs.width/2, 280);

  ctx.font = "bolder 34px monospace";
  ctx.fillStyle = '##b31100';
  ctx.textAlign = "center";
  ctx.fillText("Press [SPACEBAR] to Voyage", cvs.width/2, 360);
}

introTimer = setInterval(introLoop, 500);

// Event listeners
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
