const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

//snake def
const snake = 
{
    x: 200,
    y: 200,
    size: 20,
    dx: 0,
    dy: 0
};

//storage for items
const obstacles = [];
const food = [];

let lives = 3;
let score = 0;

let isGameOver = false;

const collectSound = new Audio('collect.wav');
const hitSound = new Audio('hit.ogg');
const winSound = new Audio('win.wav');

//random placement of boxes
function createObstacles() 
{
    for (let i = 0; i < 10; i++) 
    {
        obstacles.push({
            x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height),
            size: 20
        });
    }
}

//random placement of food
function createFood() 
{
    for (let i = 0; i < 5; i++) 
    {
        food.push({
            x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height),
            size: Math.floor(Math.random() * 20) + 10
        });
    }
}

//draw snake time
function drawSnake() 
{
    ctx.fillStyle = 'green';
    ctx.fillRect(snake.x, snake.y, snake.size, snake.size);
}

//obsticles are easdy boxes
function drawObstacles() 
{
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => 
    {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

//food is just a box with a different name
function drawFood() 
{
    food.forEach(item => 
    {
        ctx.fillStyle = 'green';
        ctx.fillRect(item.x, item.y, item.size, item.size);
    });
}

function drawScore() 
{
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 10, 40);
}

function drawLives() 
{
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Lives: " + lives, 10, 20);
}

function update() 
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    //check for collisions with obstacles
    obstacles.forEach(obstacle => 
    {
        if (snake.x < obstacle.x + obstacle.size &&
            snake.x + snake.size > obstacle.x &&
            snake.y < obstacle.y + obstacle.size &&
            snake.y + snake.size > obstacle.y) 
            {
            lives--;
            hitSound.play();

            if (lives === 0) 
            {
                //set game over to true so we can reset with a button
                isGameOver = true;
                alert('Game Over! You ran out of lives.');
                clearInterval(gameInterval);
                document.getElementById('resetButton').disabled = false;
            }
        }
    });

    //check for collisions with food
    food.forEach((item, index) => 
    {
        if (snake.x < item.x + item.size &&
            snake.x + snake.size > item.x &&
            snake.y < item.y + item.size &&
            snake.y + snake.size > item.y) 
        {
            food.splice(index, 1);
            score += 10;
            collectSound.play();
        }
    });

    if (food.length === 0) 
    {
        isGameOver = true;
        winSound.play();
        alert('You win! All food collected.');
        clearInterval(gameInterval);
        document.getElementById('resetButton').disabled = false;
    }

    drawSnake();
    drawObstacles();
    drawFood();
    drawScore();
    drawLives();
}



//key press events for direction
document.addEventListener('keydown', (event) => 
    {
    switch (event.key) 
    {
        case 'ArrowUp':
            snake.dx = 0;
            snake.dy = -snake.size;
            break;
        case 'ArrowDown':
            snake.dx = 0;
            snake.dy = snake.size;
            break;
        case 'ArrowLeft':
            snake.dx = -snake.size;
            snake.dy = 0;
            break;
        case 'ArrowRight':
            snake.dx = snake.size;
            snake.dy = 0;
            break;
    }
});

function resetGame() 
{
    if (isGameOver) 
    {
        location.reload();
    }
}

createObstacles();
createFood();
const gameInterval = setInterval(update, 100);