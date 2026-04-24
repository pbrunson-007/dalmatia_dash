const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const speciesLabel = document.getElementById("species-label");
const scoreLabel = document.getElementById("score-label");
const finalScore = document.getElementById("final-score");
const factText = document.getElementById("fact-text");
const scoreForm = document.getElementById("score-form");
const playerNameInput = document.getElementById("player-name");
const scoreSubmitButton = scoreForm.querySelector("button");
const startLeaderboard = document.getElementById("start-leaderboard");
const gameOverLeaderboard = document.getElementById("game-over-leaderboard");
const apolloButton = document.getElementById("apollo-button");
const vultureButton = document.getElementById("vulture-button");
const restartButton = document.getElementById("restart-button");

const leaderboardKey = "dalmatianSpeciesTopScores";
const collectibleBonus = 5;
const startMenuItems = [apolloButton, vultureButton];
const gameOverMenuItems = [playerNameInput, scoreSubmitButton, restartButton];

const speciesData = {
  apollo: {
    name: "Apollo Butterfly",
    gravity: 0.22,
    flapPower: -5.6,
    playerColor: "#ffe64d",
    accentColor: "#ff4fa3",
    obstacleColor: "#7a4f24",
    obstacleLabel: "Habitat loss",
    facts: [
      "Did you know: Apollo butterflies depend on open mountain meadows and can be harmed when habitats become fragmented.",
      "Did you know: Apollo butterfly caterpillars feed on stonecrop plants that grow well in rocky limestone landscapes.",
      "Did you know: On the Dalmatian coast, karst habitats can support rare plants that butterflies need to survive.",
      "Did you know: When meadows are split apart by roads or development, Apollo butterflies have fewer safe places to fly and reproduce.",
    ],
  },
  vulture: {
    name: "Griffin Vulture",
    gravity: 0.34,
    flapPower: -6.8,
    playerColor: "#d6c09c",
    accentColor: "#3c2d24",
    obstacleColor: "#5d6b82",
    obstacleLabel: "Cliffs / power lines",
    facts: [
      "Did you know: Griffin vultures use warm rising air currents to glide above cliffs and karst landscapes with very little wing flapping.",
      "Did you know: Power lines and other human infrastructure can be dangerous for large soaring birds like Griffin vultures.",
      "Did you know: Griffin vultures help ecosystems by cleaning up carrion and returning nutrients to the landscape.",
      "Did you know: Rocky cliffs along Mediterranean karst areas can provide important nesting places for Griffin vultures.",
    ],
  },
};

let selectedSpecies;
let player;
let obstacles;
let collectibles;
let bonusPopups;
let score;
let finalScoreValue;
let frameCount;
let animationId;
let gameRunning = false;
let scoreSubmitted = false;
let startMenuIndex = 0;
let gameOverMenuIndex = 0;

function showScreen(screen) {
  startScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  screen.classList.remove("hidden");

  if (screen === startScreen) {
    setStartMenuFocus(0);
  } else if (screen === gameOverScreen) {
    setGameOverMenuFocus(0);
  } else {
    clearMenuFocus();
  }
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
  collectibles = [];
  bonusPopups = [];
  score = 0;
  finalScoreValue = 0;
  frameCount = 0;
  gameRunning = true;
  scoreSubmitted = false;
  scoreLabel.textContent = "0";
  scoreForm.classList.remove("hidden");
  playerNameInput.value = "";
  playerNameInput.disabled = false;
  scoreSubmitButton.disabled = false;
  scoreSubmitButton.textContent = "Save";

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

  if (frameCount % 150 === 75) {
    createCollectible();
  }

  for (const obstacle of obstacles) {
    obstacle.x -= 3;
  }

  for (const collectible of collectibles) {
    collectible.x -= 3;
  }

  for (const popup of bonusPopups) {
    popup.y -= 0.8;
    popup.life -= 1;
  }

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
  collectibles = collectibles.filter((collectible) => collectible.x + collectible.size > 0);
  bonusPopups = bonusPopups.filter((popup) => popup.life > 0);

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

  collectBonusStones();
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

function createCollectible() {
  collectibles.push({
    x: canvas.width + 30,
    y: randomNumber(70, canvas.height - 100),
    size: 24,
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
  drawCollectibles();
  drawPlayer();
  drawBonusPopups();
}

function drawBackground() {
  ctx.fillStyle = "#29bdf2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#1d7a52";
  ctx.fillRect(0, canvas.height - 32, canvas.width, 32);

  ctx.fillStyle = "#29a843";
  for (let x = 0; x < canvas.width; x += 32) {
    ctx.fillRect(x, canvas.height - 44, 16, 12);
  }

  ctx.fillStyle = "#fff7d6";
  drawPixelCloud(80, 70);
  drawPixelCloud(420, 105);

  ctx.fillStyle = "#ffe64d";
  ctx.fillRect(610, 36, 36, 36);
  ctx.fillStyle = "#ff9f1c";
  ctx.fillRect(646, 48, 12, 12);
  ctx.fillRect(598, 48, 12, 12);
}

function drawPixelCloud(x, y) {
  ctx.fillRect(x, y, 32, 16);
  ctx.fillRect(x + 16, y - 16, 48, 16);
  ctx.fillRect(x + 48, y, 40, 16);
}

function drawObstacles() {
  ctx.font = "14px ArcadeFont, Courier New";
  ctx.textAlign = "center";

  for (const obstacle of obstacles) {
    ctx.fillStyle = selectedSpecies.obstacleColor;
    ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.topHeight);
    ctx.fillRect(
      obstacle.x,
      obstacle.topHeight + obstacle.gapHeight,
      obstacle.width,
      canvas.height - obstacle.topHeight - obstacle.gapHeight
    );

    ctx.fillStyle = "#fff7d6";
    ctx.fillRect(obstacle.x, obstacle.topHeight - 10, obstacle.width, 10);
    ctx.fillRect(obstacle.x, obstacle.topHeight + obstacle.gapHeight, obstacle.width, 10);

    ctx.fillStyle = "#071029";
    ctx.fillText(selectedSpecies.obstacleLabel, obstacle.x + obstacle.width / 2, 24);
  }
}

function drawCollectibles() {
  for (const collectible of collectibles) {
    drawKarstStone(collectible.x, collectible.y, collectible.size);
  }
}

function drawKarstStone(x, y, size) {
  ctx.fillStyle = "#f1f0d8";
  ctx.fillRect(x, y + 8, size, size - 8);
  ctx.fillRect(x + 6, y, size - 6, 8);

  ctx.fillStyle = "#a7a58d";
  ctx.fillRect(x, y + size - 6, size, 6);
  ctx.fillRect(x + size - 6, y + 8, 6, size - 8);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 5, y + 8, 6, 6);
  ctx.fillStyle = "#705f49";
  ctx.fillRect(x + 10, y + 16, 6, 6);
}

function drawBonusPopups() {
  ctx.font = "16px ArcadeFont, Courier New";
  ctx.textAlign = "center";

  for (const popup of bonusPopups) {
    ctx.fillStyle = "#071029";
    ctx.fillText(`+${popup.value}`, popup.x + 2, popup.y + 2);
    ctx.fillStyle = "#ffe64d";
    ctx.fillText(`+${popup.value}`, popup.x, popup.y);
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  if (selectedSpecies === speciesData.apollo) {
    drawApolloSprite();
  } else {
    drawVultureSprite();
  }

  ctx.restore();
}

function drawApolloSprite() {
  ctx.fillStyle = "#071029";
  ctx.fillRect(-4, -14, 8, 28);

  ctx.fillStyle = selectedSpecies.accentColor;
  ctx.fillRect(-28, -22, 20, 18);
  ctx.fillRect(8, -22, 20, 18);
  ctx.fillRect(-24, 2, 16, 18);
  ctx.fillRect(8, 2, 16, 18);

  ctx.fillStyle = selectedSpecies.playerColor;
  ctx.fillRect(-20, -14, 8, 8);
  ctx.fillRect(12, -14, 8, 8);
  ctx.fillRect(-18, 8, 6, 6);
  ctx.fillRect(12, 8, 6, 6);
}

function drawVultureSprite() {
  ctx.fillStyle = selectedSpecies.accentColor;
  ctx.fillRect(-34, -6, 22, 14);
  ctx.fillRect(-12, -14, 30, 22);
  ctx.fillRect(18, -4, 22, 12);
  ctx.fillRect(-4, 8, 22, 12);

  ctx.fillStyle = selectedSpecies.playerColor;
  ctx.fillRect(16, -14, 18, 12);
  ctx.fillRect(30, -10, 12, 8);

  ctx.fillStyle = "#071029";
  ctx.fillRect(28, -10, 4, 4);
  ctx.fillStyle = "#ffe64d";
  ctx.fillRect(42, -8, 8, 6);
}

function collectBonusStones() {
  collectibles = collectibles.filter((collectible) => {
    if (!hitsCollectible(collectible)) {
      return true;
    }

    score += collectibleBonus * 10;
    scoreLabel.textContent = Math.floor(score / 10);
    bonusPopups.push({
      x: collectible.x + collectible.size / 2,
      y: collectible.y,
      value: collectibleBonus,
      life: 55,
    });

    return false;
  });
}

function hitsCollectible(collectible) {
  const closestX = Math.max(collectible.x, Math.min(player.x, collectible.x + collectible.size));
  const closestY = Math.max(collectible.y, Math.min(player.y, collectible.y + collectible.size));
  const distanceX = player.x - closestX;
  const distanceY = player.y - closestY;

  return distanceX * distanceX + distanceY * distanceY < player.radius * player.radius;
}

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animationId);
  finalScoreValue = Math.floor(score / 10);
  finalScore.textContent = finalScoreValue;
  factText.textContent = getRandomFact();
  renderLeaderboards();
  showScreen(gameOverScreen);
  playerNameInput.focus();
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFact() {
  const facts = selectedSpecies.facts;
  return facts[randomNumber(0, facts.length - 1)];
}

function getLeaderboard() {
  const savedScores = localStorage.getItem(leaderboardKey);

  if (!savedScores) {
    return [];
  }

  try {
    const parsedScores = JSON.parse(savedScores);
    return Array.isArray(parsedScores) ? parsedScores : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(leaderboardKey, JSON.stringify(entries));
}

function addScore(name, scoreValue) {
  const leaderboard = getLeaderboard();

  leaderboard.push({
    name,
    score: scoreValue,
  });

  leaderboard.sort((first, second) => second.score - first.score);
  saveLeaderboard(leaderboard.slice(0, 3));
  renderLeaderboards();
}

function renderLeaderboards() {
  const leaderboard = getLeaderboard();
  renderLeaderboard(startLeaderboard, leaderboard);
  renderLeaderboard(gameOverLeaderboard, leaderboard);
}

function renderLeaderboard(list, leaderboard) {
  list.innerHTML = "";

  for (let index = 0; index < 3; index += 1) {
    const scoreEntry = leaderboard[index];
    const item = document.createElement("li");
    const rankInfo = document.createElement("span");
    const badge = document.createElement("span");
    const name = document.createElement("span");
    const scoreText = document.createElement("span");

    rankInfo.className = "rank-info";
    badge.className = `medal ${getMedalClass(index)}`;

    if (scoreEntry) {
      name.textContent = `${index + 1}. ${scoreEntry.name}`;
      scoreText.textContent = scoreEntry.score;
    } else {
      item.className = "empty-score";
      name.textContent = `${index + 1}. ????`;
      scoreText.textContent = "0";
    }

    rankInfo.append(badge, name);
    item.append(rankInfo, scoreText);
    list.appendChild(item);
  }
}

function getMedalClass(index) {
  if (index === 0) {
    return "gold";
  }

  if (index === 1) {
    return "silver";
  }

  return "bronze";
}

function formatArcadeName(name) {
  const arcadeName = name.trim().toUpperCase().slice(0, 4);
  return arcadeName || "????";
}

function setStartMenuFocus(index) {
  startMenuIndex = wrapIndex(index, startMenuItems.length);
  clearMenuFocus();
  startMenuItems[startMenuIndex].classList.add("menu-selected");
  startMenuItems[startMenuIndex].focus();
}

function setGameOverMenuFocus(index) {
  gameOverMenuIndex = wrapIndex(index, gameOverMenuItems.length);

  if (gameOverMenuItems[gameOverMenuIndex].disabled) {
    setGameOverMenuFocus(gameOverMenuIndex + 1);
    return;
  }

  clearMenuFocus();
  gameOverMenuItems[gameOverMenuIndex].classList.add("menu-selected");
  gameOverMenuItems[gameOverMenuIndex].focus();
}

function clearMenuFocus() {
  for (const item of [...startMenuItems, ...gameOverMenuItems]) {
    item.classList.remove("menu-selected");
  }
}

function wrapIndex(index, itemCount) {
  return (index + itemCount) % itemCount;
}

function isStartScreenVisible() {
  return !startScreen.classList.contains("hidden");
}

function isGameOverScreenVisible() {
  return !gameOverScreen.classList.contains("hidden");
}

function isArrowKey(code) {
  return ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(code);
}

function moveDirection(code) {
  return code === "ArrowLeft" || code === "ArrowUp" ? -1 : 1;
}

function handleStartMenuKey(event) {
  if (isArrowKey(event.code)) {
    event.preventDefault();
    setStartMenuFocus(startMenuIndex + moveDirection(event.code));
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    startMenuItems[startMenuIndex].click();
  }
}

function handleGameOverMenuKey(event) {
  if (isArrowKey(event.code)) {
    event.preventDefault();
    setGameOverMenuFocus(gameOverMenuIndex + moveDirection(event.code));
    return;
  }

  if (event.code !== "Enter") {
    return;
  }

  event.preventDefault();

  if (gameOverMenuItems[gameOverMenuIndex] === playerNameInput) {
    scoreForm.requestSubmit();
  } else if (gameOverMenuItems[gameOverMenuIndex] === scoreSubmitButton) {
    scoreForm.requestSubmit();
  } else {
    restartButton.click();
  }
}

apolloButton.addEventListener("click", () => startGame("apollo"));
vultureButton.addEventListener("click", () => startGame("vulture"));
restartButton.addEventListener("click", () => showScreen(startScreen));

scoreForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (scoreSubmitted) {
    return;
  }

  scoreSubmitted = true;
  addScore(formatArcadeName(playerNameInput.value), finalScoreValue);
  playerNameInput.disabled = true;
  scoreSubmitButton.disabled = true;
  scoreSubmitButton.textContent = "Saved";
  setGameOverMenuFocus(2);
});

playerNameInput.addEventListener("input", () => {
  playerNameInput.value = playerNameInput.value.toUpperCase().slice(0, 4);
});

window.addEventListener("keydown", (event) => {
  if (isStartScreenVisible()) {
    handleStartMenuKey(event);
    return;
  }

  if (isGameOverScreenVisible()) {
    handleGameOverMenuKey(event);
    return;
  }

  if (event.code === "Space") {
    event.preventDefault();
    flap();
  }
});

canvas.addEventListener("click", flap);
renderLeaderboards();
setStartMenuFocus(0);
