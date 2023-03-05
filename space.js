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

// Overall functions
window.onload = function () {
  board = document.getElementById("board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");

  // Draw initial ship
  shipImg = new Image();
  shipImg.src = "/player.png";
  shipImg.onload = function () {
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
  };

  requestAnimationFrame(update);
  document.addEventListener('keydown', moveShip);
};

function update() {
  requestAnimationFrame(update)

  context.clearRect(0, 0, board.width, board.height)

  // ship redraw when moving
  context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
}

function moveShip(e) {
  if (e.code == 'ArrowLeft' && ship.x - shipVelocityX >= 0) {
    ship.x -= shipVelocityX; // move Left one tile
  } else if (e.code == 'ArrowRight' && ship.x + shipVelocityX + ship.width <= board.width) {
    ship.x += shipVelocityX; // move Right one tile
  }
}

function createAliens() {
  
}
