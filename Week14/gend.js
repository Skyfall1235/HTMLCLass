var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {
    this.load.image('ship', 'ship.png');
    this.load.image('bullet', 'bullet.png');
    this.load.image('enemy', 'enemy.png');
    this.load.image('shield', 'shield.png');
    this.load.image('rapidFire', 'rapidFire.png');
    this.load.spritesheet('explosion', 'explosion.png', { frameWidth: 32, frameHeight: 32, endFrame: 9 });
}

function create () {
    // Player's spaceship
    this.ship = this.add.image(400, 550, 'ship').setScale(0.5);

    // Player's bullets
    this.bullets = this.physics.add.group();

    // Enemies
    this.enemies = this.physics.add.group();
    this.spawnEnemy();

    // Power-ups
    this.powerups = this.physics.add.group();
    this.powerups.create(Phaser.Math.Between(0, 800), 0, 'shield');
    this.powerups.create(Phaser.Math.Between(0, 800), 0, 'rapidFire');

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Explosion animation
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion'),
        frameRate: 20,
        repeat: 0
    });

    // Collisions
    this.physics.add.collider(this.bullets, this.enemies, this.destroyEnemy, null, this);
    this.physics.add.overlap(this.enemies, this.ship, this.shipHit, null, this);
    this.physics.add.overlap(this.ship, this.powerups, this.collectPowerup, null, this);
}

function update () {
    // Player movement
    if (this.cursors.left.isDown) {
        this.ship.x -= 5;
    } else if (this.cursors.right.isDown) {
        this.ship.x += 5;
    }

    // Player shooting
    if (this.cursors.space.isDown && this.time.now > this.nextFire) {
        this.fireBullet();
        this.nextFire = this.time.now + this.fireRate;
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
        powerup.y += 100;
        if (powerup.y > 600) {
            powerup.y = 0;
            powerup.x = Phaser.Math.Between(0, 800);
        }
    });
}

function fireBullet() {
    let bullet = this.bullets.get(this.ship.x, this.ship.y - 20, 'bullet');
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-500);
    }
}

function spawnEnemy() {
    let x = Phaser.Math.Between(0, 800);
    let enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(100);
}

function destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    var explosion = this.add.sprite(enemy.x, enemy.y, 'explosion').play('explode');
    explosion.on('animationcomplete', () => { explosion.destroy(); });
}

function shipHit(ship, enemy) {
    if (!ship.hasShield) {
        // Handle ship damage or game over
        console.log("Ship hit!");
        // You might want to reduce a health bar, or trigger a game over state
    } else {
        enemy.destroy();
    }
}

function collectPowerup(ship, powerup) {
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