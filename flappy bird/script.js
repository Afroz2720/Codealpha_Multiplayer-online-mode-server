// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 400;
canvas.height = 600;

// Game variables
let birdX = 50;
let birdY = canvas.height / 2; // Start in the middle of the canvas
let birdRadius = 20;
let gravity = 0.6;
let lift = -12;
let birdVelocity = 0;

let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 2;

let score = 0;
let gameOver = false;
let hasGameStarted = false;

// Images
const birdImg = new Image();
birdImg.src = 'https://i.postimg.cc/FsqxKggD/png-transparent-flappy-bird-tap-bird-2d-basic-flappy-angry-birds-animals-smiley-bird.png'; // Bird image URL

const pipeImgTop = new Image();
pipeImgTop.src = 'https://i.postimg.cc/zXmCZXJc/flappy-bird-pipe-transparent-11549930651hqzkrjyfcl.png'; // Top pipe image URL

const pipeImgBottom = new Image();
pipeImgBottom.src = 'https://i.postimg.cc/zXmCZXJc/flappy-bird-pipe-transparent-11549930651hqzkrjyfcl.png'; // Bottom pipe image URL

// DOM Elements
const gameOverPopup = document.getElementById('gameOverPopup');
const retryButton = document.getElementById('retryButton');

// Bird control
document.addEventListener('keydown', () => {
  if (!hasGameStarted) {
    hasGameStarted = true;
    gameLoop();
  }
  birdVelocity = lift;
});

// Add pipes at intervals
function addPipe() {
  const pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 20;
  pipes.push({
    x: canvas.width,
    top: pipeHeight,
    bottom: pipeHeight + pipeGap,
  });
}

// Draw bird
function drawBird() {
  ctx.drawImage(birdImg, birdX - birdRadius, birdY - birdRadius, birdRadius * 2, birdRadius * 2);
}

// Draw pipes
function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImgTop, pipe.x, 0, pipeWidth, pipe.top);
    ctx.drawImage(pipeImgBottom, pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom);
  });
}

// Update pipes
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= pipeSpeed;

    // Collision detection with pipes
    if (
      birdX + birdRadius > pipe.x &&
      birdX - birdRadius < pipe.x + pipeWidth &&
      (birdY - birdRadius < pipe.top || birdY + birdRadius > pipe.bottom)
    ) {
      gameOver = true;
    }

    // Increment score when the bird passes a pipe
    if (pipe.x + pipeWidth < birdX && !pipe.scored) {
      score++;
      pipe.scored = true; // Ensure each pipe only scores once
    }
  });

  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0); // Remove off-screen pipes
}

// Update bird position
function updateBird() {
  if (!hasGameStarted) return;

  birdVelocity += gravity; // Apply gravity
  birdY += birdVelocity; // Update bird's vertical position

  // Check canvas boundaries
  if (birdY - birdRadius < 0 || birdY + birdRadius > canvas.height) {
    gameOver = true;
  }
}

// Draw score
function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30); // Score at top-right
}

// Display "Game Over" popup
function showGameOverPopup() {
  gameOverPopup.style.display = 'block';
}

// Retry button click event
retryButton.addEventListener('click', () => {
  birdY = canvas.height / 2; // Reset bird position
  birdVelocity = 0; // Reset velocity
  pipes = [];
  score = 0;
  gameOver = false;
  hasGameStarted = false;

  gameOverPopup.style.display = 'none'; // Hide popup
});

// Main game loop
function gameLoop() {
  if (gameOver) {
    showGameOverPopup();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  drawScore();

  updateBird();
  updatePipes();

  requestAnimationFrame(gameLoop);
}

// Start adding pipes every 2 seconds
setInterval(() => {
  if (hasGameStarted && !gameOver) {
    addPipe();
  }
}, 2000);
