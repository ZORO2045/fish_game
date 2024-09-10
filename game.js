window.onload = () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 750;

    const playButton = document.getElementById('playButton');
    const resetButton = document.getElementById('resetButton');

    const backgroundImg = new Image();
    backgroundImg.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ziH5FzxgRgzDN3kTzTLtituhASPuKpfAkA&usqp=CAU';

    const birdImg = new Image();
    birdImg.src = 'https://i.ibb.co/k629f7k/spritesheet.png';

    const birdFlap = new Audio('https://www.myinstants.com/media/sounds/sfx_wing.mp3');

    let bird = {
        x: 150,
        y: 200,
        vy: 0,
        width: 45,
        height: 39,
        weight: 1,
        frameX: 0
    };

    let btnPressed = false;
    let angle = 0;
    let hue = 0;
    let frame = 0;
    let score = 0;
    let gameSpeed = 2;
    let gameoverho = false;

    playButton.ontouchstart = () => {
        btnPressed = true;
    };

    playButton.ontouchend = () => {
        btnPressed = false;
    };

    function handleBackground() {
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }

    function handleBird() {
        let curve = Math.sin(angle) * 20;
        if (bird.y > canvas.height - (bird.height * 3) + curve) {
            bird.y = canvas.height - (bird.height * 3) + curve;
            bird.vy = 0;
        } else {
            bird.vy += bird.weight;
            bird.vy *= 0.9;
            bird.y += bird.vy;
        }
        if (bird.y < 0 + bird.height) {
            bird.y = 0 + bird.height;
            bird.vy = 0;
        }
        if (btnPressed) {
            bird.vy -= 2;
            birdFlap.play();
        }
        ctx.drawImage(birdImg, bird.frameX * bird.width, 0, bird.width, bird.height, bird.x, bird.y, bird.width, bird.height);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleBackground();
        handleBird();
        ctx.font = '40px Georgia';
        ctx.fillStyle = 'red';
        ctx.fillText(score, canvas.width / 40, canvas.height / 10);
        ctx.strokeText(score, canvas.width, 70);

        angle -= 0.12;
        hue++;
        frame++;

        if (!gameoverho) {
            requestAnimationFrame(animate);
        }
    }

    resetButton.onclick = () => {
        bird.x = 150;
        bird.y = 200;
        bird.vy = 0;
        score = 0;
        gameSpeed = 2;
        gameoverho = false;
        animate();
    };

    animate();
};
