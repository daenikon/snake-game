console.log("test");

const C = document.createElement("canvas");
C.width = 512;
C.height = C.width;
C.style.border = "1px solid black";

document.body.appendChild(C);

const CTX = C.getContext("2d");
const GRID = 32;
const SQUARE_WIDTH = C.width / 32;

const Game = {
  isAppleSpawned: false,
  gameOver: false,
  score: 0,
}

const Snake = {
  segments: [ [SQUARE_WIDTH * 5, SQUARE_WIDTH * 5], [SQUARE_WIDTH * 5, SQUARE_WIDTH * 4], [SQUARE_WIDTH * 5, SQUARE_WIDTH * 3] ],
  isDead: false,
  update: function() {
    CTX.fillColor = "blue";
    this.segments.forEach(segment => {
      CTX.fillRect(segment[0], segment[1], SQUARE_WIDTH, SQUARE_WIDTH);
    })
  }
}

Snake.update()
