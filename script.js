const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [];
let direction = "RIGHT";
let food = {};
let score = 0;
let gameInterval = null;
let isRunning = false;
let isGameOver = false;

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
    ctx.fillRect(part.x, part.y, box, box);
  });

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

// Move snake
function moveSnake() {
  let head = { ...snake[0] };

  if (direction === "RIGHT") head.x += box;
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Wall wrap
  if (head.x >= canvas.width) head.x = 0;
  if (head.x < 0) head.x = canvas.width - box;
  if (head.y >= canvas.height) head.y = 0;
  if (head.y < 0) head.y = canvas.height - box;

  // Collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGameScreen();
      return;
    }
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    placeFood();
  } else {
    snake.pop();
  }
}

// Game loop
function gameLoop() {
  if (!isRunning || isGameOver) return;
  moveSnake();
  draw();
}

// Place food
function placeFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// Controls
document.addEventListener("keydown", e => {
  if (!isRunning) return;
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Mobile buttons
function simulateKey(key) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

upBtn.onclick = () => simulateKey("ArrowUp");
downBtn.onclick = () => simulateKey("ArrowDown");
leftBtn.onclick = () => simulateKey("ArrowLeft");
rightBtn.onclick = () => simulateKey("ArrowRight");

// Game buttons
startBtn.onclick = () => {
  clearInterval(gameInterval);
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;
  isGameOver = false;
  isRunning = true;
  placeFood();
  gameInterval = setInterval(gameLoop, 180);
};

pauseBtn.onclick = () => {
  isRunning = false;
};

resumeBtn.onclick = () => {
  if (!isGameOver) isRunning = true;
};

endBtn.onclick = () => {
  clearInterval(gameInterval);
  location.reload();
};

// Game over screen
function endGameScreen() {
  isRunning = false;
  isGameOver = true;
  clearInterval(gameInterval);

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "red";
  ctx.font = "32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}