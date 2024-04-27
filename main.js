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
const GRID = 16;
const SW = Math.floor(C.width / GRID); // square width

const Game = {
  gameOver: false,
  score: 0,
  tick: 100,
  userCommands: [], // updated every tick

  start: function() {
    Snake.render();
    Apple.spawn();

    const intervalId = setInterval(function() {
      Snake.updateDirection();
      Snake.move();
      Snake.ateApple();
      if(Snake.ateItself()) {
        clearInterval(intervalId);
      };
    }, this.tick)
  },

  isOnSnake: function(position) {
    return Snake.body.some(segment => segment[0] === position[0] && segment[1] === position[1]);
  },

  updateScore: function(points) {
    this.score += points;
    document.getElementById("score").textContent = this.score;
  },
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
      console.log("Spawned inside snake");
    }
    
    CTX.fillStyle = "red";
    CTX.fillRect(this.position[0], this.position[1], SW, SW);
  }
}

const Snake = {
  color: "blue",
  isDead: false,

  body: [ [SW * 5, SW * 5], [SW * 5, SW * 4] ], // head is the first element
  direction: [0, 1],

  render: function() {
    CTX.fillStyle = "blue";
    this.body.forEach(segment => {
      CTX.fillRect(segment[0], segment[1], SW, SW);
    })
  },

  updateDirection: function() { // this is called "Input Buffering"
    const direction = Game.userCommands.pop();
    if (direction == undefined) return;
    Game.userCommands = [];
    if (direction[0] == this.direction[0] * -1 && direction[1] == this.direction[1] * -1) return;
    this.direction = direction;
  },
  
  move: function() {
    let head = this.body[0]
    let newHead = [head[0] + this.direction[0] * SW, head[1] + this.direction[1] * SW];
    if (newHead[0] >= C.width) newHead[0] = 0;
    else if (newHead[0] < 0) newHead[0] = C.width - SW;
    if (newHead[1] >= C.width) newHead[1] = 0;
    else if (newHead[1] < 0) newHead[1] = C.width - SW;
    this.body.unshift(newHead);
    const tail = this.body.pop();
    CTX.clearRect(tail[0], tail[1], SW, SW);
    CTX.fillStyle = this.color;
    CTX.fillRect(this.body[0][0], this.body[0][1], SW, SW);
  },

  ateApple: function() {
    if (Game.isOnSnake(Apple.position)) {
      Game.updateScore(100);
      Apple.spawn();
      this.grow();
    }
  },

  grow: function() {
    const tail = this.body[this.body.length - 1];
    this.body.push(tail);
  },

  ateItself: function() {
    const head = this.body[0];
    for (let i = 1; i < this.body.length; i++) {
      if (head[0] === this.body[i][0] && head[1] === this.body[i][1]) {
        console.log("dead :(");
        Game.gameOver = true;
        Snake.isDead = true;
        return true;
      }
    }
    return false;
  },
}

document.addEventListener('keydown', function(e) {
  if (e.key in COMMANDS) {
    Game.userCommands.push(COMMANDS[e.key]);
  }
})

Game.start()
