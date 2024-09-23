const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Dynamische canvasgrootte gebaseerd op het schermformaat
function resizeCanvas() {
    let size = Math.min(window.innerWidth, window.innerHeight) * 0.9; // Neem 90% van de kleinste afmeting (breedte of hoogte)
    canvas.width = size;
    canvas.height = size;
    snakeSize = size / 20; // Zorg dat de snake-segmenten op schaal zijn, bv. 20 segmenten in één richting
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Roep bij start op

// Game variabelen
let snake = [{x: snakeSize * 5, y: snakeSize * 5}];
let snakeDir = {x: 1, y: 0};
let blotter = randomPosition();
let score = 0;
let speed = 150;
let isGrowing = false;
let throughWall = true;
let showProfessor = false;
let professorX = canvas.width;
let professorY = Math.random() * (canvas.height - 50);
let professorSpeed = 2;
let musicPlaying = false;

// Laad geluidseffecten
const backgroundMusic = document.getElementById('backgroundMusic');
const blotterSound = document.getElementById('blotterSound');

// Touch input variabelen
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Swipe controls voor mobiele apparaten
canvas.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}, false);

canvas.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}, false);

function handleSwipe() {
    let dx = touchEndX - touchStartX;
    let dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontale swipe
        if (dx > 0 && snakeDir.x === 0) {
            snakeDir = {x: 1, y: 0}; // Swipe naar rechts
        } else if (dx < 0 && snakeDir.x === 0) {
            snakeDir = {x: -1, y: 0}; // Swipe naar links
        }
    } else {
        // Verticale swipe
        if (dy > 0 && snakeDir.y === 0) {
            snakeDir = {x: 0, y: 1}; // Swipe naar beneden
        } else if (dy < 0 && snakeDir.y === 0) {
            snakeDir = {x: 0, y: -1}; // Swipe naar boven
        }
    }
}

function gameLoop() {
    if (isGameOver()) return;

    if (!musicPlaying) {
        backgroundMusic.play();
        musicPlaying = true;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Snake verplaatsen
    moveSnake();

    // Snake tekenen
    drawSnake();

    // Blotter tekenen
    drawBlotter();

    // Professor tekenen
    if (showProfessor) {
        drawProfessor();
    } else if (Math.random() < 0.01) {
        showProfessor = true;
    }

    if (professorX < -100) {
        professorX = canvas.width;
        professorY = Math.random() * (canvas.height - 50);
        showProfessor = false;
    }

    drawScore();
    setTimeout(gameLoop, speed);
}

function moveSnake() {
    const head = {x: snake[0].
