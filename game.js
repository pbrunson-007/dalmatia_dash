const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const speciesLabel = document.getElementById("species-label");
const scoreLabel = document.getElementById("score-label");
const finalScore = document.getElementById("final-score");
const factText = document.getElementById("fact-text");

const speciesData = {
  apollo: {
    name: "Apollo Butterfly",
    gravity: 0.22,
    flapPower: -5.6,
    playerColor: "#f8f3e9",
    accentColor: "#c64f3d",
    obstacleColor: "#8a6f42",
    obstacleLabel: "Habitat loss",
    fact: "Apollo butterflies are threatened by habitat fragmentation in Europe.",
  },
  vulture: {
    name: "Griffin Vulture",
    gravity: 0.34,
    flapPower: -6.8,
    playerColor: "#d8c4a1",
    accentColor: "#6b4c32",
    obstacleColor: "#5f6670",
    obstacleLabel: "Cliffs / power lines",
    fact: "Griffin vultures rely on thermal currents and are impacted by human infrastructure.",
  },
};

let selectedSpecies;
let player;
let obstacles;
let score;
let frameCount;
let animationId;
let gameRunning = false;

function showScreen(screen) {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

function startGame(speciesKey) {
  selectedSpecies = speciesData[speciesKey];
  speciesLabel.textContent = selectedSpecies.name;

  player = {
    x: 120,
    y: canvas.height / 2,
    radius: 18,
    velocity: 0,
  };

  obstacles = [];
  score = 0;
  frameCount = 0;
  gameRunning = true;
  scoreLabel.textContent = "0";

  showScreen(gameScreen);
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(gameLoop);
}

function flap() {
  if (!gameRunning) {
    return;
  }

  player.velocity = selectedSpecies.flapPower;
}

function gameLoop() {
  updateGame();
  drawGame();

  if (gameRunning) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function updateGame() {
  frameCount += 1;
  score += 1;
  scoreLabel.textContent = Math.floor(score / 10);

  player.velocity += selectedSpecies.gravity;
  player.y += player.velocity;

  if (frameCount % 95 === 1) {
    createObstacle();
  }

  for (const obstacle of obstacles) {
    obstacle.x -= 3;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

  if (player.y + player.radius >= canvas.height || player.y - player.radius <= 0) {
    endGame();
    return;
  }

  for (const obstacle of obstacles) {
    if (hitsObstacle(obstacle)) {
      endGame();
      return;
    }
  }
}

function createObstacle() {
  const gapHeight = selectedSpecies === speciesData.apollo ? 150 : 135;
  const topHeight = randomNumber(60, canvas.height - gapHeight - 80);

  obstacles.push({
    x: canvas.width,
    width: 74,
    topHeight,
    gapHeight,
  });
}

function hitsObstacle(obstacle) {
  const playerLeft = player.x - player.radius;
  const playerRight = player.x + player.radius;
  const playerTop = player.y - player.radius;
  const playerBottom = player.y + player.radius;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const gapTop = obstacle.topHeight;
  const gapBottom = obstacle.topHeight + obstacle.gapHeight;

  const horizontallyOverlaps = playerRight > obstacleLeft && playerLeft < obstacleRight;
  const verticallyHits = playerTop < gapTop || playerBottom > gapBottom;

  return horizontallyOverlaps && verticallyHits;
}

function drawGame() {
  drawBackground();
  drawObstacles();
  drawPlayer();
}

function drawBackground() {
  ctx.fillStyle = "#bde7f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#7ab97d";
  ctx.fillRect(0, canvas.height - 32, canvas.width, 32);

  ctx.fillStyle = "#ffffff";
  drawCloud(120, 72);
  drawCloud(470, 105);
}

function drawCloud(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.arc(x + 22, y - 8, 24, 0, Math.PI * 2);
  ctx.arc(x + 48, y, 18, 0, Math.PI * 2);
  ctx.fill();
}

function drawObstacles() {
  ctx.fillStyle = selectedSpecies.obstacleColor;
  ctx.font = "14px Arial";
  ctx.textAlign = "center";

  for (const obstacle of obstacles) {
    ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
    ctx.fillRect(
      obstacle.x,
      obstacle.topHeight + obstacle.gapHeight,
      obstacle.width,
      canvas.height - obstacle.topHeight - obstacle.gapHeight
    );

    ctx.fillStyle = "#19312a";
    ctx.fillText(selectedSpecies.obstacleLabel, obstacle.x + obstacle.width / 2, 24);
    ctx.fillStyle = selectedSpecies.obstacleColor;
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  ctx.fillStyle = selectedSpecies.playerColor;
  ctx.beginPath();
  ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = selectedSpecies.accentColor;

  if (selectedSpecies === speciesData.apollo) {
    ctx.beginPath();
    ctx.ellipse(-12, 0, 16, 24, -0.5, 0, Math.PI * 2);
    ctx.ellipse(12, 0, 16, 24, 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(-20, 4);
    ctx.lineTo(0, -16);
    ctx.lineTo(24, 4);
    ctx.lineTo(0, 16);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(7, -5, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  finalScore.textContent = Math.floor(score / 10);
  factText.textContent = selectedSpecies.fact;
  showScreen(gameOverScreen);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("apollo-button").addEventListener("click", () => startGame("apollo"));
document.getElementById("vulture-button").addEventListener("click", () => startGame("vulture"));
document.getElementById("restart-button").addEventListener("click", () => showScreen(startScreen));

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    flap();
  }
});

canvas.addEventListener("click", flap);
