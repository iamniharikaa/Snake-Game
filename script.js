const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

document.body.addEventListener("touchmove", e => e.preventDefault(), { passive: false });

const box = 20;
let snake, direction, food, score;
let gameInterval = null;
let isRunning = false;
let isGameOver = false;

// Swipe variables
let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  isGameOver = false;
  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Snake
  snake.forEach((part, i) => {
    ctx.beginPath();
    ctx.fillStyle = i === 0 ? "#4ade80" : "#22c55e";
    ctx.roundRect(part.x, part.y, box - 2, box - 2, 8);
    ctx.fill();

    // Eyes
    if (i === 0) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(part.x + 6, part.y + 6, 2, 0, Math.PI * 2);
      ctx.arc(part.x + 14, part.y + 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Food
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
}

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

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }
}

function checkCollision() {
  let head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGameScreen();
      return;
    }
  }
}

function gameLoop() {
  if (isGameOver) return;
  moveSnake();
  checkCollision();
  draw();
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
["up", "down", "left", "right"].forEach(dir => {
  document.getElementById(dir + "Btn").addEventListener("click", () => {
    if (!isRunning) return;
    if (dir === "up" && direction !== "DOWN") direction = "UP";
    if (dir === "down" && direction !== "UP") direction = "DOWN";
    if (dir === "left" && direction !== "RIGHT") direction = "LEFT";
    if (dir === "right" && direction !== "LEFT") direction = "RIGHT";
  });
});

// Swipe
canvas.addEventListener("touchstart", e => {
  e.preventDefault();
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: false });

canvas.addEventListener("touchend", e => {
  e.preventDefault();
  if (!isRunning) return;
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
}, { passive: false });

// Buttons
document.getElementById("startBtn").onclick = () => {
  if (isRunning) return;
  initGame();
  gameInterval = setInterval(gameLoop, 180);
  isRunning = true;
};

document.getElementById("pauseBtn").onclick = () => {
  clearInterval(gameInterval);
  isRunning = false;
};

document.getElementById("resumeBtn").onclick = () => {
  if (!isRunning && !isGameOver) {
    gameInterval = setInterval(gameLoop, 180);
    isRunning = true;
  }
};

document.getElementById("endBtn").onclick = endGameScreen;

function endGameScreen() {
  clearInterval(gameInterval);
  isRunning = false;
  isGameOver = true;

  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ef4444";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}