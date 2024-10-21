var gameArea = {
    canvas : document.getElementById("game"),
    sceneObjects : [],//hiearchy like unity

    start: function()
    {
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
    
}

function startGame()
{
    gameArea.start();
}

function gameTick()//starts game ticks, includes interval for each item
{
    //loops through nodes, if start is not called, call it.
    //loop through hierarchy and call update.
}



function drawCircle(x, y, radius, color) 
{
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

//keep track of game objects in a list
//create game object
class gameObject
{
    constructor(x = 0, y = 0, width = 0, height = 0, imageSrc = null, color = 'white')
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.started = false;

        if(this.image)
        {
            this.image = new Image();
            this.image.src = imageSrc;
        }
        else
        {
            this.image = null;
        }
    }

    onStart()
    {

    }

    onUpdate()
    {

    }

    move(x, y)
    {
        this.x + x;
        this.y = y;
    }

    drawObject(ctx)
    {
        if(this.image)
        {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}