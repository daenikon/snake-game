console.log("test");

const C = document.createElement("canvas");
C.width = 512;
C.height = C.width;
C.style.border = "1px solid black";

document.body.appendChild(C);

const CTX = C.getContext("2d");
const GRID = 32;
const SW = C.width / 32; // square width

const Game = {
  gameOver: false,
  score: 0,
}

const Apple = {
  isSpawned: false,
  position: [],
  getRandomPosition: function() {
    const x = Math.floor(Math.random() * GRID) * SW;
    const y = Math.floor(Math.random() * GRID) * SW;
    return [x, y];
  },
  spawn: function() {
    this.pos = this.getRandomPosition();
    
    CTX.fillStyle = "red";
    CTX.fillRect(this.pos[0], this.pos[1], SW, SW);
  }
}

const Snake = {
  body: [ [SW * 5, SW * 5], [SW * 5, SW * 4], [SW * 5, SW * 3] ], // head is the first element
  direction: [0, 1],
  isDead: false,
  render: function() {
    CTX.fillStyle = "blue";
    this.body.forEach(segment => {
      CTX.fillRect(segment[0], segment[1], SW, SW);
    })
  },
  move: function() {
    // Update Head
    let head = this.body[0]
    let newHead = [head[0] + this.direction[0] * SW, head[1] + this.direction[1] * SW];
    
    // Update Body
    this.body.unshift(newHead);
    // Clean tail
    console.log(this.body)
    const tail = this.body.pop();
    CTX.clearRect(tail[0], tail[1], SW, SW);

    this.render()
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key = " ") {
    Snake.move()
  }
})

Snake.render()
Apple.spawn()
