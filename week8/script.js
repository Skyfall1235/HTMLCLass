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
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.size, obstacle.size);
    });
}

//food is just a box with a different name
function drawFood()
{
    food.forEach(item => {
        ctx.fillStyle = 'green';
        ctx.fillRect(item.x, item.y, item.size, item.size);
    });
}

function update()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    //check for collisions with obstacles
    //everyones favorite, AXIS ALIGNED BOUNDING BOXES WHOOOO (aabb)
    obstacles.forEach(obstacle =>
    {
        if (snake.x < obstacle.x + obstacle.size &&
            snake.x + snake.size > obstacle.x &&
            snake.y < obstacle.y + obstacle.size &&
            snake.y + snake.size > obstacle.y)
        {
            alert('Game Over! You hit an obstacle.');
            clearInterval(gameInterval);
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
        }
    });

    if (food.length === 0)
    {
        alert('You win! All food collected.');
        clearInterval(gameInterval);
    }

    drawSnake();
    drawObstacles();
    drawFood();
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

createObstacles();
createFood();
const gameInterval = setInterval(update, 100);