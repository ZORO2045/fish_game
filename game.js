const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bird = new Bird();
let obstacles = [];
let isGameOver = false;
let score = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    bird.update();
    bird.draw();
    handleObstacles();
    checkCollision();
    displayScore();
    if (!isGameOver) {
        requestAnimationFrame(animate);
    }
}

document.getElementById('playButton').addEventListener('click', () => {
    animate();
});

document.getElementById('resetButton').addEventListener('click', () => {
    resetGame();
});

function resetGame() {
    bird = new Bird();
    obstacles = [];
    score = 0;
    isGameOver = false;
    animate();
}

class Bird {
    constructor() {
        this.x = 150;
        this.y = canvas.height / 2;
        this.vy = 0;
        this.width = 34;
        this.height = 24;
        this.weight = 1;
        this.frameX = 0;
        this.sprite = new Image();
        this.sprite.src = 'https://i.ibb.co/k629f7k/spritesheet.png';
    }
    update() {
        let curve = Math.sin(angle) * 20;
        if (this.y > canvas.height - this.height * 3) {
            this.y = canvas.height - this.height * 3;
            this.vy = 0;
        } else {
            this.vy += this.weight;
            this.y += this.vy;
        }

        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }

        if (btnPressed) {
            this.flap();
        }
    }
    draw() {
        ctx.drawImage(this.sprite, this.frameX * 670, 0, 670, 588, this.x - 20, this.y - 10, this.width * 1.5, this.height * 1.5);
    }
    flap() {
        this.vy -= 2;
        if (this.frameX >= 3) {
            this.frameX = 0;
        } else if (frame % 2 === 0) {
            this.frameX++;
        }
    }
}

function handleObstacles() {
    if (frame % 90 === 0) {
        obstacles.push(new Obstacle());
    }
    obstacles.forEach((obstacle, index) => {
        obstacle.update();
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    });
}

class Obstacle {
    constructor() {
        this.top = (Math.random() * canvas.height / 3) + 20;
        this.bottom = (Math.random() * canvas.height / 3) + 20;
        this.x = canvas.width;
        this.width = 50;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
        this.counted = false;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.top);
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    update() {
        this.x -= gameSpeed;
        if (!this.counted && this.x < bird.x) {
            score++;
            this.counted = true;
        }
        this.draw();
    }
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            bird.x < obstacle.x + obstacle.width &&
            bird.x + bird.width > obstacle.x &&
            (bird.y < 0 + obstacle.top || bird.y + bird.height > canvas.height - obstacle.bottom)
        ) {
            ctx.font = '32px Helvetica';
            ctx.fillStyle = 'white';
            ctx.fillText('You Lost! Score: ' + score, canvas.width / 4, canvas.height / 2 - 10);
            isGameOver = true;
        }
    });
}

function drawBackground() {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function displayScore() {
    ctx.font = '25px Helvetica';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 20, 50);
}

let frame = 0;
let gameSpeed = 2;
let hue = 0;
let angle = 0;
let btnPressed = false;

window.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        btnPressed = true;
    }
});
window.addEventListener('keyup', function (e) {
    if (e.code === 'Space') {
        btnPressed = false;
        bird.frameX = 0;
    }
});
