//TO DO
// - add sounds
// - create score
// - get collisions working
// - get projectiles firing
// - create a bounds for the players movement
// - game over screen with high score (kinda done)

let highScore = 0;


class GameScene extends Phaser.Scene{
    constructor(){
        super('GameScene')
    }

    preload () {
        this.load.image('ship', 'Assets/Ship_1.png');
        this.load.image('bullet', 'Assets/green_laser.png');
        this.load.image('enemy', 'Assets/ship_3.png');
        this.load.image('shield', 'Assets/Bubble.png');
        //this.load.image('rapidFire', 'rapidFire.png');
        //this.load.spritesheet('explosion', 'explosion.png', { frameWidth: 32, frameHeight: 32, endFrame: 9 });
    }

    create () {
        // Player's spaceship
        this.ship = this.add.image(400, 550, 'ship').setScale(2);
    
        // Player's bullets
        this.bullets = this.physics.add.group();
    
        // Enemies
        this.enemies = this.physics.add.group();
        this.spawnEnemy();
    
        // Power-ups
        this.powerups = this.physics.add.group();
        this.powerups.create(Phaser.Math.Between(0, 800), 0, 'shield').setScale(0.03);
        //this.powerups.create(Phaser.Math.Between(0, 800), 0, 'rapidFire');
    
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Collisions
        this.physics.add.collider(this.bullets, this.enemies, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.enemies, this.ship, this.shipHit, null, this);
    this.physics.add.overlap(this.ship, this.powerups, this.collectPowerup, null, this);
    }

    update () {
        // Player movement
        if (this.cursors.left.isDown) {
            this.ship.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.ship.x += 5;
        }
    
        // Player shooting
        if (this.cursors.up.isDown) {
            console.log("small issue");
        }
    
        // Enemy movement
        this.enemies.children.iterate(enemy => {
            if (enemy.y > 600) {
                enemy.destroy();
                this.spawnEnemy();
            }
        });
    
        // Power-up movement
        this.physics.world.wrap(this.powerups, 0, 0);
        this.powerups.children.iterate(powerup => {
            powerup.y += 1;
            if (powerup.y > 600) {
                powerup.y = 0;
                powerup.x = Phaser.Math.Between(0, 800);
            }
        });
    }

    fireBullet() {
        let bullet = this.bullets.get(this.ship.x, this.ship.y - 20, 'bullet');
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.setVelocityY(-500);
            bullet.angle = 180;
        }
    }
    
    spawnEnemy() {
        let x = Phaser.Math.Between(0, 800);
        let enemy = this.enemies.create(x, 0, 'enemy').setScale(1.5);
        enemy.angle = 180;
        enemy.setVelocityY(10);
    }
    
    destroyEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        highScore += 10;
        var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion').play('explode');
        explosion.on('animationcomplete', () => { explosion.destroy(); });
    }
    
    shipHit(ship, enemy) {
        if (!ship.hasShield) {
            // Handle ship damage or game over
            console.log("Ship hit!");
            // You might want to reduce a health bar, or trigger a game over state
        } else {
            enemy.destroy();
        }
    }
    
    collectPowerup(ship, powerup) {
        powerup.destroy();
        if (powerup.texture.key === 'shield') {
            // Activate shield for a limited time
            ship.hasShield = true;
            this.time.addEvent({ delay: 5000, callback: () => { ship.hasShield = false; }, callbackScope: this, repeat: 0 });
        } else if (powerup.texture.key === 'rapidFire') {
            // Increase fire rate for a limited time
            this.fireRate = 200;
            this.time.addEvent({ delay: 5000, callback: () => { this.fireRate = 500; }, callbackScope: this, repeat: 0 });
        }
    }
}

class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    preload () {
        this.load.image('ship', 'Assets/Ship_1.png');
    }

    create() {
        // Black background
        this.add.rectangle(400, 300, 800, 600, 0x000000);

        // Ship image
        this.add.image(400, 200, 'ship').setScale(3);

        // Title text
        this.add.text(400, 100, 'Space Shooter', { fontSize: '35px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // Start button
        this.startButton = this.add.text(400, 400, 'Start Game', { fontSize: '30px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Replace 'GameScene' with your actual game scene name
        });
    }
}

class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        // Add game over text
        this.add.text(400, 200, 'Game Over', { fontSize: '32px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // Add high score text
        let highScoreText = 'High Score: ' + highScore;
        this.add.text(400, 300, highScoreText, { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);

        // Add a restart button
        this.restartButton = this.add.text(400, 400, 'Restart', { fontSize: '24px', fill: '#fff', align: 'center' }).setOrigin(0.5);
        this.restartButton.setInteractive();
        this.restartButton.on('pointerdown', () => {
            highScore = 0;
            this.scene.start('GameScene'); // Replace 'GameScene' with your actual game scene name
        });
    }
}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade' // Use 'arcade' for Arcade Physics
    },
    scene: [TitleScene, GameScene, GameOverScene]
};

var game = new Phaser.Game(config);
