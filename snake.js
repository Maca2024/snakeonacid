const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let snake = [{x: 150, y: 150}];
let snakeDir = {x: 1, y: 0}; 
let snakeSize = 20;
let blotter = randomPosition();
let score = 0;
let speed = 150; 
let isGrowing = false;
let throughWall = true; // Allows the snake to go through walls
let showProfessor = false;
let professorX = canvas.width;
let professorY = Math.random() * (canvas.height - 50); // Random Y position for professor
let professorSpeed = 2;
let musicPlaying = false;

// Load sound effects
const backgroundMusic = document.getElementById('backgroundMusic');
const blotterSound = document.getElementById('blotterSound');

// Key input for controlling snake
document.addEventListener('keydown', changeDirection);

function gameLoop() {
    if (isGameOver()) return;
    
    // Start background music if not already playing
    if (!musicPlaying) {
        backgroundMusic.play();
        musicPlaying = true;
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move snake
    moveSnake();

    // Draw snake
    drawSnake();

    // Draw blotter
    drawBlotter();

    // Draw professor on a bike (special animation)
    if (showProfessor) {
        drawProfessor();
    } else if (Math.random() < 0.01) { // Randomly show the professor
        showProfessor = true;
    }

    // Check if professor should keep moving or disappear
    if (professorX < -100) { // Professor disappears after moving off screen
        professorX = canvas.width;
        professorY = Math.random() * (canvas.height - 50); // Random new Y position
        showProfessor = false;
    }

    // Draw score
    drawScore();

    // Control snake speed and recursion for the game loop
    setTimeout(gameLoop, speed);
}

function moveSnake() {
    const head = {x: snake[0].x + snakeDir.x * snakeSize, y: snake[0].y + snakeDir.y * snakeSize};

    // Allow snake to pass through walls
    if (throughWall) {
        if (head.x >= canvas.width) head.x = 0;
        else if (head.x < 0) head.x = canvas.width - snakeSize;
        if (head.y >= canvas.height) head.y = 0;
        else if (head.y < 0) head.y = canvas.height - snakeSize;
    }

    snake.unshift(head);

    if (head.x === blotter.x && head.y === blotter.y) {
        // Snake ate the blotter
        score += 10;
        blotter = randomPosition();
        isGrowing = true;
        blotterSound.play(); // Play sound when blotter is eaten
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = `hsl(${(index * 30) % 360}, 100%, 50%)`; 
        ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
}

function drawBlotter() {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 70%)`; 
    ctx.fillRect(blotter.x, blotter.y, snakeSize, snakeSize);
}

function drawProfessor() {
    // Simple "professor on a bike" animation
    const img = new Image();
    img.src = 'professor.png'; // You need to provide a bike image with a professor
    ctx.drawImage(img, professorX, professorY, 80, 50);
    professorX -= professorSpeed;
}

function randomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize
    };
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && snakeDir.y === 0) {
        snakeDir = {x: 0, y: -1};
    } else if (key === 'ArrowDown' && snakeDir.y === 0) {
        snakeDir = {x: 0, y: 1};
    } else if (key === 'ArrowLeft' && snakeDir.x === 0) {
        snakeDir = {x: -1, y: 0};
    } else if (key === 'ArrowRight' && snakeDir.x === 0) {
        snakeDir = {x: 1, y: 0};
    }
}

function isGameOver() {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            alert('Game Over! You collided with yourself.');
            document.location.reload();
            return true;
        }
    }
    return false;
}

function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 20, 30);
}

// Start the game loop
gameLoop();
