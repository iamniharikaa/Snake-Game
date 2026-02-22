
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let isGameOver = false;
let gameInterval = null;
let isRunning = false;

let snake = [{ x: 200, y: 200 }];
let direction = "RIGHT";

let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};

let score = 0;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  snake.forEach((part, index) => {
    ctx.beginPath();
    ctx.fillStyle = index === 0 ? "#4ade80" : "#22c55e";
    ctx.roundRect(part.x, part.y, box - 2, box - 2, 8);
    ctx.fill();

    
    if (index === 0) {
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(part.x + 6, part.y + 6, 2, 0, Math.PI * 2);
      ctx.arc(part.x + 14, part.y + 6, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  
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
document.addEventListener("keydown", e => {
  if (!isRunning) return;

  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});
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

function startGame() {
  if (isRunning) return;

  snake = [{ x: 200, y: 200 }];
  direction = "RIGHT";
  score = 0;
  document.getElementById("score").innerText = score;

  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };

  isGameOver = false;
  draw();

  gameInterval = setInterval(gameLoop, 180);
  isRunning = true;
}

function pauseGame() {
  if (isRunning) {
    clearInterval(gameInterval);
    isRunning = false;
  }
}

function resumeGame() {
  if (!isRunning) {
    gameInterval = setInterval(gameLoop, 180);
    isRunning = true;
  }
}

function endGame() {
  clearInterval(gameInterval);
  isRunning = false;
  alert("Game Ended");
  location.reload();
}
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

  ctx.font = "18px Arial";
  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(
    "Snake bit its tail",
    canvas.width / 2,
    canvas.height / 2 + 35
  );
}
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", pauseGame);
document.getElementById("resumeBtn").addEventListener("click", resumeGame);
document.getElementById("endBtn").addEventListener("click", endGame);
// ===== MOBILE CONTROLS =====
function simulateKey(key) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key })
  );
}

document.getElementById("upBtn")?.addEventListener("click", () => simulateKey("ArrowUp"));
document.getElementById("downBtn")?.addEventListener("click", () => simulateKey("ArrowDown"));
document.getElementById("leftBtn")?.addEventListener("click", () => simulateKey("ArrowLeft"));
document.getElementById("rightBtn")?.addEventListener("click", () => simulateKey("ArrowRight"));

