// board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context;

// ship
let shipWidth = tileSize * 1.5;
let shipHeight = tileSize;
let shipX = tileSize * (columns / 2) - tileSize; // keeps the ship in the middle
let shipY = tileSize * rows - tileSize * 2;

let ship = {
  x: shipX,
  y: shipY,
  width: shipWidth,
  height: shipHeight,
};

let shipImg;
let shipVelocityX = tileSize; //ship moving speed

// Aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // number of aliens to shoot
let alienVelocityX = 0.5; // Moving speed

let score = 0;
let gameOver = false;

// Lasers
let laserArray = [];
let laserVelocityY = -10; // Laser speed

// Overall functions
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // Draw initial ship
  shipImg = new Image();
  shipImg.src = "./images/player.png";
  shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  alienImg = new Image();
  alienImg.src = "./images/alien.png";
  createAliens();

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveShip);
  document.addEventListener("keyup", shoot);
};

function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, board.width, board.height);

  // ship redraw when moving
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

  // Alien draw
  for (let i = 0; i < alienArray.length; i++) {
    let alien = alienArray[i];
    if (alien.alive) {
      alien.x += alienVelocityX;

      // if the aliens hit the border of the canvas
      if (alien.x + alien.width >= board.width || alien.x <= 0) {
        alienVelocityX *= -1;
        // Syncs the aliens together
        alien.x += alienVelocityX * 2;

        // move alien down a row each time it hits the border
        for (let j = 0; j < alienArray.length; j++) {
          alienArray[j].y += alienHeight;
        }
      }
      context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

      if (alien.y >= ship.y) {
        gameOver = true;
      }
    }
  }

  // lasers
  for (let i = 0; i < laserArray.length; i++) {
    let  laser = laserArray[i];
    laser.y += laserVelocityY;
    context.fillStyle = 'white';
    context.fillRect(laser.x, laser.y, laser.width, laser.height)

    // laser collision with aliens
    for (let j = 0; j < alienArray.length; j++) {
      let alien = alienArray[j];
      if (!laser.used && alien.alive && detectCollision(laser, alien)) {
        laser.used = true;
        alien.alive = false;
        alienCount--;
        score += 100;
      }
    }
  }

  // clear laser array otherwise game will eventually slow down
  while (laserArray.length > 0 && (laserArray[0].used || laserArray[0].y < 0)) {
    laserArray.shift();
  }

  // next alien army
  if (alienCount == 0) {
    // increase the number of aliens in columns and rows by 1
    alienColumns = Math.min(alienColumns + 1, columns / 2 -2); // means the cap is 16 / 2 - 2 = 6 columns
    alienRows = Math.min(alienRows + 1, rows - 4) // aliens do not exceed 16 - 4 rows, 12 rows max
    alienVelocityX += 0.2; // increases speed every level
    alienArray = [];
    laserArray = [];
    createAliens();
  }

  // score
  context.fillStyle = 'white';
  context.font = '16px Franklin Gothic Medium'
  context.fillText(score, 5, 20);
}

function moveShip(e) {
  if (gameOver) {
    return;
  }

  if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX; // move Left one tile
  } else if (
    e.code == "ArrowRight" &&
    ship.x + shipVelocityX + ship.width <= board.width
  ) {
    ship.x += shipVelocityX; // move Right one tile
  }
}

function createAliens() {
  for (let c = 0; c < alienColumns; c++) {
    for (let r = 0; r < alienRows; r++) {
      let alien = {
        img: alienImg,
        x: alienX + c * alienWidth,
        y: alienY + r * alienHeight,
        width: alienWidth,
        height: alienHeight,
        alive: true,
      };
      alienArray.push(alien);
    }
  }
  alienCount = alienArray.length;
}

function shoot(e) {
  if (gameOver) {
    return;
  }

  if (e.code == "Space") {
    let laser = {
      x: ship.x + (shipWidth * 15) / 32,
      y: ship.y,
      width: tileSize / 8,
      height: tileSize / 2,
      used: false,
    };
    laserArray.push(laser);
  }
}

function detectCollision (a ,b) {
  return a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && // a's top right corner passes b's top left corner
    a.y < b.y + b.height && // a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y // a's bottom left corner passes b's top left corner
}