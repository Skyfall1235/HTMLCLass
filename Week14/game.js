//TO DO
// - allow game to be repeatable
let currentScore = 0;
let highScore = 0;

class GameScene extends Phaser.Scene
{
    constructor()
    {
        super('GameScene')
        this.isShooting = false; 
        this.playerLives = 3;
        this.spawnInterval = 2000; // 2 seconds in milliseconds
        this.timerEvent;
    }

    preload () 
    {
        this.load.image('ship', 'Assets/Ship_1.png');
        this.load.image('bullet', 'Assets/green_laser.png');
        this.load.image('enemy', 'Assets/ship_3.png');
        this.load.audio('explosion', 'Assets/explosion.wav');
        this.load.audio('sfxLaser', 'Assets/laser.wav');
    }

    create () 
    {
        
        this.playerLives = 3;
        // Player's spaceship
        this.ship = this.physics.add.image(400, 550, 'ship').setScale(2);
    
        // Player's bullets
        this.bullets = this.physics.add.group();
    
        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemy();
    
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Collisions
        this.physics.add.collider(this.bullets, this.enemies, this.destroyEnemy, null, this);
        this.physics.add.overlap(this.enemies, this.ship, this.shipHit, null, this); 

        this.timerEvent = this.time.addEvent({
            delay: this.spawnInterval,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true 
        });

        // Place the title text in the top right corner
        this.scoreText = this.add.text(this.game.config.width - 70, 50, 'Score: ' + currentScore, { fontSize: '35px', fill: '#fff', align: 'right' }).setOrigin(1, 0);
        //place the players lives under it
        this.livesText = this.add.text(this.game.config.width - 70, 100, 'Lives: ' + this.playerLives, { fontSize: '35px', fill: '#fff', align: 'right' }).setOrigin(1, 0);
    }

    update () 
    {
        // Player movement
        if (this.cursors.left.isDown && this.ship.x > 0) 
        {
            this.ship.x -= 5;
        } 
        else if (this.cursors.right.isDown&& this.ship.x < 800) 
        {
            this.ship.x += 5;
        }
    
        // Player shooting
        if (this.cursors.up.isDown) 
        {
 
            this.fireBullet();
        }

        // Player shooting with fire rate control
        if (this.cursors.up.isDown) 
        {
            if (!this.isShooting) 
            { 
                this.fireBullet(); 
                this.isShooting = true; 
            }
        } 
        else 
        { 
            this.isShooting = false; 
        }
    
        // Enemy movement
        this.enemies.children.iterate(enemy => {
            if (enemy.y > 600) {
                var enemyValue = enemy.pointValue;
                enemy.destroy();
                this.spawnEnemy(enemyValue);
            }
        });
    }

    fireBullet() 
    {
        let bullet = this.bullets.get(this.ship.x, this.ship.y - 20, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(-500);
            bullet.angle = 90;
            bullet.setScale(0.1);
            this.sound.play('sfxLaser');
        }
    }
      
    //spawns an enemy at a random location at the top
    spawnEnemy(value = 0) 
    {
        let x = Phaser.Math.Between(0, 800);
        let enemy = this.enemies.create(x, 0, 'enemy').setScale(2);
        enemy.angle = 180;
        //increases speed by point value
        enemy.setVelocityY(50 + 10);
        //increases point value by 10 for every loop
        enemy.pointValue = value + 10;
    }
    
    //called when the enemy is hit by a laser
    destroyEnemy(bullet, enemy) 
    {
        currentScore += enemy.pointValue;
        bullet.destroy();
        enemy.destroy();
        this.scoreText.setText('Score: ' + currentScore)
        console.log(currentScore);
        this.sound.play('explosion');
    }
    
    //handles the ships bevahior when it gets hit
    shipHit(ship, enemy) 
    {
        console.log("Ship hit!");
        this.playerLives--;
        this.livesText.setText('Lives: ' + this.playerLives)
        enemy.destroy();
        if(this.playerLives <= 0)
        {
            // Start button
            this.startButton = this.add.text(400, 400, 'Game Over', { fontSize: '30px', fill: '#fff', align: 'center' }).setOrigin(0.5);
            this.startButton.setInteractive();
            this.startButton.on('pointerdown', () => 
            {
            this.scene.start('GameOverScene'); // Replace 'GameScene' with your actual game scene name
            });
        }

    }
    
}

class TitleScene extends Phaser.Scene 
{
    constructor() 
    {
        super('TitleScene');
    }

    preload () 
    {
        this.load.image('ship', 'Assets/Ship_1.png');
    }

    create() 
    {
        // Black background
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Ship image
        this.add.image(400, 200, 'ship').setScale(3);

        // Title text
        this.add.text(400, 100, 'Space Shooter by Wyatt Murray', { fontSize: '35px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        //explanation texts
        this.add.text(400, 250, 'How to Play:', { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        this.add.text(400, 275, '- Use left and right arrow keys to move.', { fontSize: '20px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.add.text(400, 300, '- Use the up arrow key to shoot.', { fontSize: '20px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.add.text(400, 325, '- Dodge the ships!', { fontSize: '20px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.add.text(400, 350, '- For every ship that passes, its point value increases.', { fontSize: '20px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // Start button
        this.startButton = this.add.text(400, 400, 'Start Game', { fontSize: '30px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Replace 'GameScene' with your actual game scene name
        });
    }
}

class GameOverScene extends Phaser.Scene 
{
    constructor() 
    {
        super('GameOverScene');
    }

    create() 
    {
        // Add game over text
        this.add.text(400, 200, 'Game Over', { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        if(currentScore > highScore)
        {
            highScore = currentScore;
        }

        // Add current score text
        let currentScoreText = 'Current Score: ' + currentScore;
        this.add.text(400, 300, currentScoreText, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        // Add high score text
        let highScoreText = 'High Score: ' + highScore;
        this.add.text(400, 325, highScoreText, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        
        currentScore = 0;

        // Add a restart button
        this.restartButton = this.add.text(400, 400, 'Restart', { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => {
            highScore = 0;
            this.scene.start('GameScene'); // Replace 'GameScene' with your actual game scene name
        });
    }
}

var config = 
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade' // Use 'arcade' for Arcade Physics
    },
    scene: [TitleScene, GameScene, GameOverScene]
};

var game = new Phaser.Game(config);
