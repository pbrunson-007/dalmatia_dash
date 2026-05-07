const infoScreen = document.getElementById("info-screen");
const startScreen = document.getElementById("start-screen");
const ecosystemScreen = document.getElementById("ecosystem-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameStage = document.querySelector(".game-stage");
const countdownOverlay = document.getElementById("countdown-overlay");

const speciesLabel = document.getElementById("species-label");
const scoreLabel = document.getElementById("score-label");
const finalScore = document.getElementById("final-score");
const factText = document.getElementById("fact-text");
const scoreForm = document.getElementById("score-form");
const playerNameInput = document.getElementById("player-name");
const scoreSubmitButton = scoreForm.querySelector("button");
const startLeaderboard = document.getElementById("start-leaderboard");
const gameOverLeaderboard = document.getElementById("game-over-leaderboard");
const ecosystemGrid = document.getElementById("ecosystem-grid");
const ecosystemMainNav = document.getElementById("ecosystem-main-nav");
const ecosystemDetailPanel = document.getElementById("ecosystem-detail-panel");
const animalDetailTitle = document.getElementById("animal-detail-title");
const animalDetailVisual = document.getElementById("animal-detail-visual");
const terrainDetailVisual = document.getElementById("terrain-detail-visual");
const animalDetailText = document.getElementById("animal-detail-text");
const apolloEcosystemVisual = document.getElementById("apollo-ecosystem-visual");
const vultureEcosystemVisual = document.getElementById("vulture-ecosystem-visual");
const startGameButton = document.getElementById("start-game-button");
const speciesInfoButton = document.getElementById("species-info-button");
const ecosystemButton = document.getElementById("ecosystem-button");
const ecosystemBackButton = document.getElementById("ecosystem-back-button");
const ecosystemDetailBackButton = document.getElementById("ecosystem-detail-back-button");
const alpineEcosystemCard = document.getElementById("alpine-ecosystem-card");
const velebitEcosystemCard = document.getElementById("velebit-ecosystem-card");
const apolloEcosystemCard = document.getElementById("apollo-ecosystem-card");
const vultureEcosystemCard = document.getElementById("vulture-ecosystem-card");
const apolloButton = document.getElementById("apollo-button");
const vultureButton = document.getElementById("vulture-button");
const restartButton = document.getElementById("restart-button");
const gameOverInfoButton = document.getElementById("game-over-info-button");
const muteButton = document.getElementById("mute-button");

const leaderboardKey = "dalmatianSpeciesTopScores";
const collectibleBonus = 5;
const countdownLabels = ["3", "2", "1", "GO!"];
const defaultCanvasWidth = 720;
const defaultCanvasHeight = 420;
const crashDuration = 900;
const musicStepDuration = 170;
const musicMelody = [392, 0, 523, 0, 494, 0, 392, 330, 0, 392, 440, 494, 0, 330, 0, 294];
const musicBass = [98, 0, 98, 0, 82, 0, 98, 0];
const startMenuItems = [speciesInfoButton, apolloButton, vultureButton, ecosystemButton];
const ecosystemGridMenuItems = [
  alpineEcosystemCard,
  velebitEcosystemCard,
  apolloEcosystemCard,
  vultureEcosystemCard,
  ecosystemBackButton,
];
const ecosystemDetailMenuItems = [ecosystemDetailBackButton];
let ecosystemMenuItems = ecosystemGridMenuItems;
const gameOverMenuItems = [playerNameInput, scoreSubmitButton, restartButton, gameOverInfoButton];

const animalDetailData = {
  alpine: {
    title: "Alpine Region",
    type: "terrain",
    visualClass: "alpine-visual",
    visualMarkup:
      '<span class="mountain mountain-back"></span><span class="mountain mountain-front"></span><span class="snowcap snowcap-left"></span><span class="snowcap snowcap-right"></span><span class="pine pine-left"></span><span class="pine pine-right"></span>',
    text:
      "Alpine regions support unique biodiversity, regulate water systems, and provide protected habitats for specialized mountain species. Healthy alpine plants also help reduce erosion and environmental instability.",
  },
  velebit: {
    title: "Velebit",
    type: "terrain",
    visualClass: "velebit-visual",
    visualMarkup:
      '<span class="karst-cliff cliff-left"></span><span class="karst-cliff cliff-right"></span><span class="karst-ridge"></span><span class="karst-stone stone-one"></span><span class="karst-stone stone-two"></span>',
    text:
      "Velebit connects coastal and mountain environments. Its cliffs, forests, and karst landscapes create important wildlife habitat.",
  },
  apollo: {
    title: "Apollo Butterfly",
    type: "animal",
    text:
      "Apollo butterflies support biodiversity by visiting flowering plants and contributing to pollination. They are indicator species, so population declines can signal habitat fragmentation or environmental stress.",
  },
  vulture: {
    title: "Griffon Vulture",
    type: "animal",
    text:
      "Griffon vultures help ecosystems by cleaning up carrion and recycling nutrients. By removing animal remains, they support healthier landscapes and reduce the spread of disease.",
  },
};

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
    name: "Griffon Vulture",
    gravity: 0.34,
    flapPower: -6.8,
    playerColor: "#d6c09c",
    accentColor: "#3c2d24",
    obstacleColor: "#5d6b82",
    obstacleLabel: "Cliffs / power lines",
    facts: [
      "Did you know: Griffon vultures use warm rising air currents to glide above cliffs and karst landscapes with very little wing flapping.",
      "Did you know: Power lines and other human infrastructure can be dangerous for large soaring birds like Griffon vultures.",
      "Did you know: Griffon vultures help ecosystems by cleaning up carrion and returning nutrients to the landscape.",
      "Did you know: Rocky cliffs along Mediterranean karst areas can provide important nesting places for Griffon vultures.",
    ],
  },
};

let selectedSpecies;
let player;
let obstacles;
let collectibles;
let bonusPopups;
let score;
let displayedScore = null;
let finalScoreValue;
let frameCount;
let animationId;
let scoreSubmitted = false;
let countdownTimeoutId;
let gameState = "info";
let startMenuIndex = 0;
let ecosystemMenuIndex = 0;
let gameOverMenuIndex = 0;
let lastTouchInputTime = 0;
let crashStartTime = 0;
let crashPoint = null;
let audioContext = null;
let masterGain = null;
let audioUnlocked = false;
let audioMuted = false;
let musicTimerId = null;
let musicStepIndex = 0;

function showScreen(screen) {
  infoScreen.classList.add("hidden");
  startScreen.classList.add("hidden");
  ecosystemScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  screen.classList.remove("hidden");

  if (screen === infoScreen) {
    gameOverScreen.classList.remove("screen-entering");
    gameState = "info";
    document.body.dataset.screen = "info";
    setInfoMenuFocus();
  } else if (screen === startScreen) {
    gameOverScreen.classList.remove("screen-entering");
    gameState = "speciesSelect";
    document.body.dataset.screen = "species";
    setStartMenuFocus(1);
  } else if (screen === ecosystemScreen) {
    gameOverScreen.classList.remove("screen-entering");
    gameState = "ecosystem";
    document.body.dataset.screen = "ecosystem";
    showEcosystemGridView();
  } else if (screen === gameOverScreen) {
    gameState = "gameOver";
    document.body.dataset.screen = "gameOver";
    setGameOverMenuFocus(0);
  } else {
    document.body.dataset.screen = "game";
    clearMenuFocus();
  }
}

function startGame(speciesKey) {
  resetActiveGame();
  configureCanvasForGameplay();
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
  displayedScore = null;
  finalScoreValue = 0;
  frameCount = 0;
  scoreSubmitted = false;
  updateScoreLabel();
  scoreForm.classList.remove("hidden");
  playerNameInput.value = "";
  playerNameInput.disabled = false;
  scoreSubmitButton.disabled = false;
  scoreSubmitButton.textContent = "Save";

  showScreen(gameScreen);
  gameState = "countdown";
  drawGame();
  startCountdown();
}

function flap() {
  if (gameState !== "playing") {
    return;
  }

  player.velocity = selectedSpecies.flapPower;
  playFlapSound();
}

function gameLoop() {
  if (gameState !== "playing" && gameState !== "crashing") {
    return;
  }

  if (gameState === "playing") {
    updateGame();
  }

  drawGame();
  drawCrashEffect();

  if (gameState === "crashing" && performance.now() - crashStartTime >= crashDuration) {
    beginGameOverTransition();
    return;
  }

  if (gameState === "playing" || gameState === "crashing") {
    animationId = requestAnimationFrame(gameLoop);
  }
}

function startCountdown() {
  showCountdownLabel(0);
}

function showCountdownLabel(index) {
  countdownOverlay.textContent = countdownLabels[index];
  countdownOverlay.classList.remove("hidden");
  playCountdownSound(index);

  if (index === countdownLabels.length - 1) {
    countdownTimeoutId = window.setTimeout(beginPlaying, 700);
    return;
  }

  countdownTimeoutId = window.setTimeout(() => showCountdownLabel(index + 1), 1000);
}

function beginPlaying() {
  countdownOverlay.classList.add("hidden");
  gameState = "playing";
  animationId = requestAnimationFrame(gameLoop);
}

function resetActiveGame() {
  cancelAnimationFrame(animationId);
  window.clearTimeout(countdownTimeoutId);
  countdownOverlay.classList.add("hidden");
  countdownOverlay.textContent = "";
  crashPoint = null;
  crashStartTime = 0;
}

function configureCanvasForGameplay() {
  if (!isMobileViewport()) {
    canvas.width = defaultCanvasWidth;
    canvas.height = defaultCanvasHeight;
    return;
  }

  const viewport = window.visualViewport || window;
  const viewportWidth = Math.floor(viewport.width || window.innerWidth);
  const viewportHeight = Math.floor(viewport.height || window.innerHeight);
  const nextWidth = clampNumber(viewportWidth - 22, 320, 520);
  const nextHeight = clampNumber(viewportHeight - 86, 460, 760);

  canvas.width = nextWidth;
  canvas.height = nextHeight;
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 520px)").matches;
}

function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    audioContext = new AudioContextClass();
  }

  if (!masterGain) {
    masterGain = audioContext.createGain();
    masterGain.gain.value = audioMuted ? 0 : 1;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
}

function unlockAudio() {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  if (context.state === "suspended") {
    context.resume();
  }

  audioUnlocked = true;
  startBackgroundMusic();
}

function playTone({ frequency, endFrequency, duration, type = "square", volume = 0.05, delay = 0 }) {
  if (!audioUnlocked || audioMuted) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  const startTime = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  if (endFrequency) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startTime + duration);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(masterGain || context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

function playNoiseBurst(duration = 0.16, volume = 0.045) {
  if (!audioUnlocked || audioMuted) {
    return;
  }

  const context = getAudioContext();

  if (!context) {
    return;
  }

  const sampleCount = Math.floor(context.sampleRate * duration);
  const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < sampleCount; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / sampleCount);
  }

  const source = context.createBufferSource();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 7;
  gain.gain.value = volume;

  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain || context.destination);
  source.start();
}

function startBackgroundMusic() {
  if (!audioUnlocked || audioMuted || musicTimerId) {
    return;
  }

  scheduleMusicStep();
}

function stopBackgroundMusic() {
  window.clearTimeout(musicTimerId);
  musicTimerId = null;
}

function scheduleMusicStep() {
  if (!audioUnlocked || audioMuted) {
    musicTimerId = null;
    return;
  }

  const melodyNote = musicMelody[musicStepIndex % musicMelody.length];
  const bassNote = musicBass[musicStepIndex % musicBass.length];

  if (melodyNote) {
    playTone({
      frequency: melodyNote,
      endFrequency: melodyNote * 1.015,
      duration: 0.105,
      type: "square",
      volume: 0.0014,
    });
  }

  if (bassNote && musicStepIndex % 2 === 0) {
    playTone({
      frequency: bassNote,
      endFrequency: bassNote * 0.96,
      duration: 0.14,
      type: "triangle",
      volume: 0.0011,
    });
  }

  musicStepIndex += 1;
  musicTimerId = window.setTimeout(scheduleMusicStep, musicStepDuration);
}

function setMuted(isMuted) {
  audioMuted = isMuted;

  if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(audioMuted ? 0 : 1, audioContext.currentTime, 0.015);
  }

  muteButton.classList.toggle("is-muted", audioMuted);
  muteButton.textContent = audioMuted ? "SOUND OFF" : "SOUND ON";
  muteButton.setAttribute("aria-pressed", String(audioMuted));

  if (audioMuted) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
}

function toggleMute() {
  setMuted(!audioMuted);
}

function playMenuBlip() {
  playTone({ frequency: 520, endFrequency: 760, duration: 0.055, type: "square", volume: 0.028 });
}

function playMenuSelect() {
  playTone({ frequency: 420, endFrequency: 840, duration: 0.09, type: "square", volume: 0.036 });
}

function playFlapSound() {
  playTone({ frequency: 260, endFrequency: 620, duration: 0.08, type: "square", volume: 0.032 });
}

function playCollectSound() {
  playTone({ frequency: 660, endFrequency: 990, duration: 0.07, type: "square", volume: 0.032 });
  playTone({ frequency: 990, endFrequency: 1320, duration: 0.08, type: "square", volume: 0.028, delay: 0.055 });
}

function playCrashSound() {
  playTone({ frequency: 880, endFrequency: 120, duration: 0.28, type: "sawtooth", volume: 0.048 });
  playTone({ frequency: 55, endFrequency: 35, duration: 0.22, type: "square", volume: 0.032 });
  playNoiseBurst(0.18, 0.028);
}

function playGameOverSound() {
  playTone({ frequency: 330, endFrequency: 220, duration: 0.16, type: "square", volume: 0.036 });
  playTone({ frequency: 220, endFrequency: 110, duration: 0.22, type: "square", volume: 0.032, delay: 0.14 });
}

function playCountdownSound(index) {
  const isGoLabel = countdownLabels[index] === "GO!";

  if (isGoLabel) {
    playTone({ frequency: 660, endFrequency: 1040, duration: 0.14, type: "square", volume: 0.036 });
    playTone({ frequency: 1040, endFrequency: 1320, duration: 0.1, type: "square", volume: 0.025, delay: 0.07 });
    return;
  }

  playTone({
    frequency: 300 + index * 70,
    endFrequency: 230 + index * 55,
    duration: 0.11,
    type: "square",
    volume: 0.03,
  });
}

function returnToInfo() {
  resetActiveGame();
  selectedSpecies = null;
  player = null;
  obstacles = [];
  collectibles = [];
  bonusPopups = [];
  score = 0;
  displayedScore = null;
  frameCount = 0;
  showScreen(infoScreen);
}

function showEcosystemGridView() {
  ecosystemGrid.classList.remove("hidden");
  ecosystemMainNav.classList.remove("hidden");
  ecosystemDetailPanel.classList.add("hidden");
  ecosystemMenuItems = ecosystemGridMenuItems;
  renderEcosystemAnimalVisuals();
  setEcosystemMenuFocus(0);
}

function showAnimalDetail(speciesKey) {
  const detail = animalDetailData[speciesKey];

  if (!detail) {
    return;
  }

  animalDetailTitle.textContent = detail.title;
  animalDetailText.textContent = detail.text;

  if (detail.type === "terrain") {
    animalDetailVisual.classList.add("hidden");
    terrainDetailVisual.className = `terrain-visual ${detail.visualClass} terrain-detail-visual`;
    terrainDetailVisual.innerHTML = detail.visualMarkup;
  } else {
    terrainDetailVisual.classList.add("hidden");
    animalDetailVisual.classList.remove("hidden");
    drawSpeciesPreview(animalDetailVisual, speciesKey, 1.18);
  }

  ecosystemGrid.classList.add("hidden");
  ecosystemMainNav.classList.add("hidden");
  ecosystemDetailPanel.classList.remove("hidden");
  ecosystemMenuItems = ecosystemDetailMenuItems;
  setEcosystemMenuFocus(0);
}

function renderEcosystemAnimalVisuals() {
  drawSpeciesPreview(apolloEcosystemVisual, "apollo", 1.08);
  drawSpeciesPreview(vultureEcosystemVisual, "vulture", 1.08);
}

function drawSpeciesPreview(previewCanvas, speciesKey, scale = 1) {
  const previewContext = previewCanvas.getContext("2d");
  const species = speciesData[speciesKey];

  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewContext.imageSmoothingEnabled = false;
  previewContext.save();
  previewContext.translate(previewCanvas.width / 2, previewCanvas.height / 2);
  previewContext.scale(scale, scale);

  if (speciesKey === "apollo") {
    drawApolloSprite(previewContext, species);
  } else {
    drawVultureSprite(previewContext, species);
  }

  previewContext.restore();
}

function updateGame() {
  frameCount += 1;
  score += 1;
  updateScoreLabel();

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
    startCrash();
    return;
  }

  for (const obstacle of obstacles) {
    if (hitsObstacle(obstacle)) {
      startCrash();
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
  drawPixelCloud(Math.max(190, canvas.width - 300), 105);

  ctx.fillStyle = "#ffe64d";
  const sunX = Math.max(230, canvas.width - 110);
  ctx.fillRect(sunX, 36, 36, 36);
  ctx.fillStyle = "#ff9f1c";
  ctx.fillRect(sunX + 36, 48, 12, 12);
  ctx.fillRect(sunX - 12, 48, 12, 12);
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

function drawCrashEffect() {
  if (gameState !== "crashing" || !crashPoint) {
    return;
  }

  const progress = Math.min((performance.now() - crashStartTime) / crashDuration, 1);
  const isApollo = selectedSpecies === speciesData.apollo;
  const radius = isApollo ? 24 + progress * 34 : 32 + progress * 46;
  const flicker = Math.floor(progress * 12) % 2 === 0;
  const cx = crashPoint.x;
  const cy = crashPoint.y;

  ctx.save();
  ctx.globalAlpha = 1 - progress * 0.15;

  drawCrashStarburst(cx, cy, radius, progress, flicker, isApollo);
  drawPixelExplosion(cx, cy, radius, progress, flicker, isApollo);
  drawElectricShock(cx, cy, radius, progress, flicker, isApollo);

  ctx.restore();
}

function drawCrashStarburst(x, y, radius, progress, flicker, isApollo) {
  const points = isApollo ? 8 : 11;
  const outerRadius = radius * (0.95 - progress * 0.16);
  const innerRadius = radius * (0.34 - progress * 0.08);

  ctx.fillStyle = flicker ? "#fff7d6" : "#ffe64d";
  ctx.beginPath();

  for (let index = 0; index < points * 2; index += 1) {
    const angle = -Math.PI / 2 + (Math.PI * index) / points;
    const nextRadius = index % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * nextRadius;
    const py = y + Math.sin(angle) * nextRadius;

    if (index === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = isApollo ? "#27d8ff" : "#f33f7a";
  ctx.lineWidth = isApollo ? 3 : 4;
  ctx.stroke();
}

function drawPixelExplosion(x, y, radius, progress, flicker, isApollo) {
  const fragments = isApollo ? 9 : 13;
  const colors = isApollo
    ? ["#fff7d6", "#ffe64d", "#27d8ff"]
    : ["#fff7d6", "#ffe64d", "#f33f7a", "#27d8ff"];

  for (let index = 0; index < fragments; index += 1) {
    const angle = (Math.PI * 2 * index) / fragments;
    const distance = radius * (0.32 + progress * 0.82);
    const size = Math.max(4, Math.round((isApollo ? 11 : 14) * (1 - progress * 0.58)));
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;

    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(Math.round(px / 4) * 4, Math.round(py / 4) * 4, size, size);
  }

  ctx.globalAlpha = flicker ? 0.78 : 0.48;
  ctx.fillStyle = isApollo ? "#fff7d6" : "#ffe64d";
  ctx.fillRect(x - 10, y - 10, 20, 20);
  ctx.globalAlpha = 1 - progress * 0.15;
}

function drawElectricShock(x, y, radius, progress, flicker, isApollo) {
  const boltCount = isApollo ? 5 : 7;
  const boltColor = flicker ? "#27d8ff" : "#fff7d6";
  const boltLength = radius * (1.05 - progress * 0.18);

  ctx.strokeStyle = boltColor;
  ctx.lineWidth = isApollo ? 4 : 5;
  ctx.lineCap = "square";

  for (let index = 0; index < boltCount; index += 1) {
    const angle = (Math.PI * 2 * index) / boltCount + progress * 1.8;
    const inner = radius * 0.18;
    const mid = radius * (0.45 + (index % 2) * 0.16);
    const outer = boltLength;

    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * inner, y + Math.sin(angle) * inner);
    ctx.lineTo(
      x + Math.cos(angle + 0.28) * mid,
      y + Math.sin(angle + 0.28) * mid
    );
    ctx.lineTo(
      x + Math.cos(angle - 0.12) * outer,
      y + Math.sin(angle - 0.12) * outer
    );
    ctx.stroke();
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);

  if (selectedSpecies === speciesData.apollo) {
    drawApolloSprite(ctx, selectedSpecies);
  } else {
    drawVultureSprite(ctx, selectedSpecies);
  }

  ctx.restore();
}

function drawApolloSprite(renderContext, species) {
  renderContext.fillStyle = "#071029";
  renderContext.fillRect(-4, -14, 8, 28);

  renderContext.fillStyle = species.accentColor;
  renderContext.fillRect(-28, -22, 20, 18);
  renderContext.fillRect(8, -22, 20, 18);
  renderContext.fillRect(-24, 2, 16, 18);
  renderContext.fillRect(8, 2, 16, 18);

  renderContext.fillStyle = species.playerColor;
  renderContext.fillRect(-20, -14, 8, 8);
  renderContext.fillRect(12, -14, 8, 8);
  renderContext.fillRect(-18, 8, 6, 6);
  renderContext.fillRect(12, 8, 6, 6);
}

function drawVultureSprite(renderContext, species) {
  renderContext.fillStyle = species.accentColor;
  renderContext.fillRect(-34, -6, 22, 14);
  renderContext.fillRect(-12, -14, 30, 22);
  renderContext.fillRect(18, -4, 22, 12);
  renderContext.fillRect(-4, 8, 22, 12);

  renderContext.fillStyle = species.playerColor;
  renderContext.fillRect(16, -14, 18, 12);
  renderContext.fillRect(30, -10, 12, 8);

  renderContext.fillStyle = "#071029";
  renderContext.fillRect(28, -10, 4, 4);
  renderContext.fillStyle = "#ffe64d";
  renderContext.fillRect(42, -8, 8, 6);
}

function collectBonusStones() {
  collectibles = collectibles.filter((collectible) => {
    if (!hitsCollectible(collectible)) {
      return true;
    }

    score += collectibleBonus * 10;
    updateScoreLabel();
    playCollectSound();
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
  gameState = "gameOver";
  cancelAnimationFrame(animationId);
  crashPoint = null;
  finalScoreValue = Math.floor(score / 10);
  finalScore.textContent = finalScoreValue;
  factText.textContent = getRandomFact();
  renderLeaderboards();
  showScreen(gameOverScreen);
  playerNameInput.focus();
}

function startCrash() {
  if (gameState !== "playing") {
    return;
  }

  gameState = "crashing";
  crashStartTime = performance.now();
  crashPoint = {
    x: player.x,
    y: Math.max(player.radius + 6, Math.min(player.y, canvas.height - player.radius - 6)),
  };
  player.velocity = 0;
  playCrashSound();
}

function beginGameOverTransition() {
  gameState = "gameOverTransition";
  cancelAnimationFrame(animationId);
  endGame();
  playGameOverSound();
  gameOverScreen.classList.add("screen-entering");
  window.setTimeout(() => {
    gameOverScreen.classList.remove("screen-entering");
  }, 520);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateScoreLabel() {
  const nextDisplayedScore = Math.floor(score / 10);

  if (nextDisplayedScore === displayedScore) {
    return;
  }

  displayedScore = nextDisplayedScore;
  scoreLabel.textContent = displayedScore;
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

function setInfoMenuFocus() {
  clearMenuFocus();
  startGameButton.classList.add("menu-selected");
  startGameButton.focus();
  playMenuBlip();
}

function setStartMenuFocus(index) {
  startMenuIndex = wrapIndex(index, startMenuItems.length);
  clearMenuFocus();
  startMenuItems[startMenuIndex].classList.add("menu-selected");
  startMenuItems[startMenuIndex].focus();
  playMenuBlip();
}

function setEcosystemMenuFocus(index) {
  ecosystemMenuIndex = wrapIndex(index, ecosystemMenuItems.length);
  clearMenuFocus();
  ecosystemMenuItems[ecosystemMenuIndex].classList.add("menu-selected");
  ecosystemMenuItems[ecosystemMenuIndex].focus();
  playMenuBlip();
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
  playMenuBlip();
}

function clearMenuFocus() {
  const allEcosystemMenuItems = [...ecosystemGridMenuItems, ...ecosystemDetailMenuItems];

  for (const item of [startGameButton, ...startMenuItems, ...allEcosystemMenuItems, ...gameOverMenuItems]) {
    item.classList.remove("menu-selected");
  }
}

function wrapIndex(index, itemCount) {
  return (index + itemCount) % itemCount;
}

function isStartScreenVisible() {
  return gameState === "speciesSelect";
}

function isInfoScreenVisible() {
  return gameState === "info";
}

function isGameOverScreenVisible() {
  return gameState === "gameOver";
}

function isEcosystemScreenVisible() {
  return gameState === "ecosystem";
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

function handleEcosystemMenuKey(event) {
  if (isArrowKey(event.code)) {
    event.preventDefault();
    setEcosystemMenuFocus(ecosystemMenuIndex + moveDirection(event.code));
    return;
  }

  if (event.code === "Enter") {
    event.preventDefault();
    ecosystemMenuItems[ecosystemMenuIndex].click();
  }
}

function handleInfoMenuKey(event) {
  if (event.code === "Enter" && document.activeElement === startGameButton) {
    event.preventDefault();
    startGameButton.click();
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
  } else if (gameOverMenuItems[gameOverMenuIndex] === gameOverInfoButton) {
    gameOverInfoButton.click();
  } else {
    restartButton.click();
  }
}

function handleGameTouch(event) {
  if (gameState !== "playing" && gameState !== "countdown" && gameState !== "crashing") {
    return;
  }

  event.preventDefault();

  if (gameState !== "playing") {
    return;
  }

  lastTouchInputTime = Date.now();
  flap();
}

function handleCanvasClick(event) {
  if (Date.now() - lastTouchInputTime < 450) {
    event.preventDefault();
    return;
  }

  flap();
}

startGameButton.addEventListener("click", () => {
  playMenuSelect();
  showScreen(startScreen);
});
speciesInfoButton.addEventListener("click", () => {
  playMenuSelect();
  returnToInfo();
});
ecosystemButton.addEventListener("click", () => {
  playMenuSelect();
  showScreen(ecosystemScreen);
});
ecosystemBackButton.addEventListener("click", () => {
  playMenuSelect();
  showScreen(startScreen);
});
ecosystemDetailBackButton.addEventListener("click", () => {
  playMenuSelect();
  showEcosystemGridView();
});
alpineEcosystemCard.addEventListener("click", () => {
  playMenuSelect();
  showAnimalDetail("alpine");
});
velebitEcosystemCard.addEventListener("click", () => {
  playMenuSelect();
  showAnimalDetail("velebit");
});
apolloEcosystemCard.addEventListener("click", () => {
  playMenuSelect();
  showAnimalDetail("apollo");
});
vultureEcosystemCard.addEventListener("click", () => {
  playMenuSelect();
  showAnimalDetail("vulture");
});
alpineEcosystemCard.addEventListener("focus", () => {
  ecosystemMenuIndex = ecosystemGridMenuItems.indexOf(alpineEcosystemCard);
});
velebitEcosystemCard.addEventListener("focus", () => {
  ecosystemMenuIndex = ecosystemGridMenuItems.indexOf(velebitEcosystemCard);
});
apolloEcosystemCard.addEventListener("focus", () => {
  ecosystemMenuIndex = ecosystemGridMenuItems.indexOf(apolloEcosystemCard);
});
vultureEcosystemCard.addEventListener("focus", () => {
  ecosystemMenuIndex = ecosystemGridMenuItems.indexOf(vultureEcosystemCard);
});
ecosystemBackButton.addEventListener("focus", () => {
  ecosystemMenuIndex = ecosystemGridMenuItems.indexOf(ecosystemBackButton);
});
apolloButton.addEventListener("click", () => {
  playMenuSelect();
  startGame("apollo");
});
vultureButton.addEventListener("click", () => {
  playMenuSelect();
  startGame("vulture");
});
restartButton.addEventListener("click", () => {
  playMenuSelect();
  showScreen(startScreen);
});
gameOverInfoButton.addEventListener("click", () => {
  playMenuSelect();
  returnToInfo();
});
muteButton.addEventListener("click", () => {
  unlockAudio();
  toggleMute();
  playMenuSelect();
});

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

window.addEventListener("pointerdown", unlockAudio, { once: true });
window.addEventListener("touchstart", unlockAudio, { once: true, passive: true });
window.addEventListener("keydown", unlockAudio, { once: true });

window.addEventListener("keydown", (event) => {
  if (document.activeElement === muteButton) {
    return;
  }

  if (isInfoScreenVisible()) {
    handleInfoMenuKey(event);
    return;
  }

  if (isStartScreenVisible()) {
    handleStartMenuKey(event);
    return;
  }

  if (isEcosystemScreenVisible()) {
    handleEcosystemMenuKey(event);
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

gameScreen.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") {
    return;
  }

  handleGameTouch(event);
});
gameScreen.addEventListener("touchstart", (event) => {
  if (window.PointerEvent) {
    return;
  }

  handleGameTouch(event);
}, { passive: false });
gameStage.addEventListener("touchmove", (event) => {
  if (gameState === "playing" || gameState === "countdown" || gameState === "crashing") {
    event.preventDefault();
  }
}, { passive: false });
canvas.addEventListener("click", handleCanvasClick);
renderLeaderboards();
renderEcosystemAnimalVisuals();
setMuted(false);
setInfoMenuFocus();
