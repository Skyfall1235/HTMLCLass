//here we define the stages

const StageConfig = {
    stageNumber: 1, // Optional stage number for context
    enemies: [
        {
            type: "basicEnemy", // Key to identify the type of enemy
            texture: "enemyTexture", // Texture key for the enemy
            projectileTexture: "enemyProjectile", // Texture key for projectiles
            spawnCount: 5, // Total number of this enemy to spawn
            spawnDelay: 1000, // Time between each spawn in milliseconds
            spawnLocations: [
                { x: 100, y: 50 },
                { x: 200, y: 50 },
                { x: 300, y: 50 },
                { x: 400, y: 50 },
                { x: 500, y: 50 }
            ],
            behavior: "zigzag", // Behavior key for the enemy's movement
            rateOfFire: 2000, // Time between each shot in milliseconds
            bounds: { xMin: 50, xMax: 750, yMin: 50, yMax: 300 },
            onDeath: "smallExplosion" // Behavior or callback for death
        },
        {
            type: "boss", // Boss-specific enemy
            texture: "bossTexture",
            projectileTexture: "bossProjectile",
            spawnCount: 1, // Only one boss
            spawnDelay: 10000, // Delay before boss spawns
            spawnLocations: [{ x: 400, y: 100 }], // Spawn at center
            behavior: "bossBehavior", // Boss-specific behavior
            rateOfFire: 1500,
            bounds: { xMin: 50, xMax: 750, yMin: 50, yMax: 150 },
            health: 1000,
            attackPatterns: ["circularFire", "spreadFire"], // List of attack patterns
            onDeath: "bigExplosion"
        }
    ]
};

class Projectile {
    constructor(scene, x, y, texture, direction, speed) {
        if (!direction || !direction.normalize) {
            throw new Error("Direction must be a Phaser.Math.Vector2 and should be normalized.");
        }

        this.scene = scene; // Reference to the Phaser scene
        this.sprite = scene.physics.add.sprite(x, y, texture); // Create the projectile sprite

        // Calculate velocity based on direction and speed
        const velocityX = direction.x * speed;
        const velocityY = direction.y * speed;

        this.sprite.setVelocity(velocityX, velocityY); // Set velocity
        this.sprite.setCollideWorldBounds(true); // Enable world bounds collision

        // Destroy the projectile when it goes out of bounds
        this.sprite.on('worldbounds', () => this.destroy());
    }

    destroy() {
        this.sprite.destroy(); // Remove the projectile from the game
    }
}

class MovementBehavior {
    constructor(sprite, bounds) {
        this.sprite = sprite;
        this.bounds = bounds;
    }

    // To be implemented by subclasses
    update() {
        throw new Error("update() must be implemented in subclasses");
    }
}

class ZigzagBehavior extends MovementBehavior {
    constructor(sprite, bounds, horizontalSpeed = 100, verticalSpeed = 50, changeInterval = 1000) {
        super(sprite, bounds);

        // Initialize zigzag-specific properties
        this.direction = 1; // 1 for right, -1 for left
        this.changeTime = 0; // Time to switch direction
        this.horizontalSpeed = horizontalSpeed;
        this.verticalSpeed = verticalSpeed;
        this.changeInterval = changeInterval;
    }

    update(time) {
        // Change direction at intervals
        if (time > this.changeTime) {
            this.direction *= -1; // Flip direction
            this.changeTime = time + this.changeInterval; // Set next change time
        }

        // Set velocity based on zigzag direction and bounds
        const velocityX = this.horizontalSpeed * this.direction;
        const velocityY = this.verticalSpeed;

        this.sprite.setVelocity(velocityX, velocityY);

        // Ensure the sprite stays within bounds horizontally
        if (this.sprite.x < this.bounds.xMin || this.sprite.x > this.bounds.xMax) {
            this.direction *= -1; // Reverse direction if out of bounds
            this.sprite.x = Phaser.Math.Clamp(this.sprite.x, this.bounds.xMin, this.bounds.xMax); // Clamp position
        }
    }
}

class Enemy {
    constructor(scene, x, y, texture, behavior, rateOfFire, projectileTexture, bounds, onDeath) {
        this.scene = scene; // Reference to the Phaser scene
        this.sprite = scene.physics.add.sprite(x, y, texture); // Create the enemy sprite
        this.sprite.setCollideWorldBounds(true);

        this.behavior = behavior; // Function defining enemy movement
        this.rateOfFire = rateOfFire; // Rate of fire in milliseconds
        this.projectileTexture = projectileTexture; // Projectile texture key
        this.bounds = bounds; // Boundary box for movement
        this.onDeath = onDeath; // Callback for death behavior

        this.isAlive = true;

        // Set up a timer for shooting projectiles
        scene.time.addEvent({
            delay: this.rateOfFire,
            loop: true,
            callback: this.shootProjectile,
            callbackScope: this
        });

        // Movement behavior
        this.scene.events.on('update', () => {
            if (this.isAlive) {
                this.behavior(this.sprite, this.bounds);
            }
        });
    }

    shootProjectile(incomingDirectionV2) {
        if (!this.isAlive) return;

        // Example: Fire downward at a speed of 200
        const direction = new Phaser.Math.Vector2(incomingDirectionV2).normalize(); // Downward
        const speed = 200;

        // Use the Projectile class
        new Projectile(this.scene, this.sprite.x, this.sprite.y + this.sprite.height / 2, this.projectileTexture, direction, speed);
    }

    destroy() {
        if (!this.isAlive) return;

        this.isAlive = false;
        this.sprite.destroy(); // Remove the sprite
        if (this.onDeath) this.onDeath(this.sprite); // Trigger the death callback
    }
}

class Boss extends Enemy {
    constructor(scene, x, y, texture, behavior, rateOfFire, projectileTexture, bounds, onDeath, health, attackPatterns) {
        super(scene, x, y, texture, behavior, rateOfFire, projectileTexture, bounds, onDeath);

        this.health = health; // Boss's health
        this.attackPatterns = attackPatterns || []; // Array of attack pattern functions
        this.currentPatternIndex = 0; // Start with the first attack pattern

        // Timer to cycle through attack patterns
        this.scene.time.addEvent({
            delay: 5000, // Change attack pattern every 5 seconds
            loop: true,
            callback: this.nextAttackPattern,
            callbackScope: this
        });
    }

    // Override the shootProjectile method to support attack patterns
    shootProjectile() {
        if (!this.isAlive) return;

        // Use the current attack pattern
        if (this.attackPatterns.length > 0) {
            this.attackPatterns[this.currentPatternIndex](this);
        }
    }

    // Cycle to the next attack pattern
    nextAttackPattern() {
        this.currentPatternIndex = (this.currentPatternIndex + 1) % this.attackPatterns.length;
    }

    // Custom takeDamage method for the boss
    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy(); // Call the inherited destroy method
        }
    }

    // Override destroy to include custom death behavior
    destroy() {
        if (!this.isAlive) return;

        super.destroy(); // Call the base class's destroy method
        console.log("Boss defeated!");
        // Add custom death effects here, like spawning power-ups or explosions
    }
}

const circularFire = (boss) => {
    const speed = 200;
    const numProjectiles = 8;

    for (let i = 0; i < numProjectiles; i++) {
        const angle = Phaser.Math.DegToRad((360 / numProjectiles) * i);
        const direction = new Phaser.Math.Vector2(Math.cos(angle), Math.sin(angle)).normalize();
        new Projectile(boss.scene, boss.sprite.x, boss.sprite.y, boss.projectileTexture, direction, speed);
    }
};

const spreadFire = (boss) => {
    const directions = [
        new Phaser.Math.Vector2(-0.5, 1).normalize(),
        new Phaser.Math.Vector2(0, 1).normalize(),
        new Phaser.Math.Vector2(0.5, 1).normalize()
    ];
    const speed = 200;

    directions.forEach(direction => {
        new Projectile(boss.scene, boss.sprite.x, boss.sprite.y, boss.projectileTexture, direction, speed);
    });
};


