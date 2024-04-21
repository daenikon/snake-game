console.log("test");

const C = document.createElement("canvas");
C.width = 512;
C.height = C.width;
C.style.border = "1px solid black";

document.body.appendChild(C);

const COMMANDS = {
  "ArrowUp": [0, -1],
  "ArrowRight": [1, 0],
  "ArrowDown": [0, 1],
  "ArrowLeft": [-1, 0],
  "w": [0, -1],
  "d": [1, 0],
  "s": [0, 1],
  "a": [-1, 0],
}

const CTX = C.getContext("2d");
const GRID = 32;
const SW = C.width / 32; // square width
const TICK = 100; // miliseconds

const Game = {
  gameOver: false,
  score: 0,
  userCommands: [], // updated every tick
  updateSnakeDirection: function() {
  },
  isOnSnake: function(position) {
    return Snake.body.some(segment => segment[0] === position[0] && segment[1] === position[1]);
  },
  start: function() {
    Snake.render();
    Apple.spawn();

    const intervalId = setInterval(function() {
      Snake.updateDirection();
      Snake.move();
      Snake.ateApple();
    }, TICK)
  }
}

const Apple = {
  position: [],
  getRandomPosition: function() {
    const x = Math.floor(Math.random() * GRID) * SW;
    const y = Math.floor(Math.random() * GRID) * SW;
    return [x, y];
  },
  spawn: function() {
    this.position = this.getRandomPosition();

    while(Game.isOnSnake(this.position)) {
      this.position = this.getRandomPosition();
      console.log("Spawned in snake");
    }
    
    CTX.fillStyle = "red";
    CTX.fillRect(this.position[0], this.position[1], SW, SW);
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
  updateDirection: function() { // this is called "Input Buffering"
    const direction = Game.userCommands.pop();
    // return if no command was given
    if (direction == undefined) return;
    // update Game.userCommands
    Game.userCommands = [];
    // return if opposite direction
    if (direction[0] == this.direction[0] * -1 && direction[1] == this.direction[1] * -1) return;
    // update direction
    this.direction = direction;
  },
  move: function() {
    // Update Head
    let head = this.body[0]
    let newHead = [head[0] + this.direction[0] * SW, head[1] + this.direction[1] * SW];
    
    // Update Body
    this.body.unshift(newHead);
    // Clean tail
    const tail = this.body.pop();
    CTX.clearRect(tail[0], tail[1], SW, SW);

    this.render()
  },
  ateApple: function() {
    if (Game.isOnSnake(Apple.position)) {
      Game.score += 100;
      console.log(Game.score);
      Apple.spawn();
      this.grow();
    }
  },
  grow: function() {
    const tail = this.body[this.body.length - 1];
    this.body.push(tail);
  },
}

document.addEventListener('keydown', function(e) {
  if (e.key in COMMANDS) {
    Game.userCommands.push(COMMANDS[e.key]);
  }
})

Game.start()
