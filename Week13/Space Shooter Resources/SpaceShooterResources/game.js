

class SceneMainMenu extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMainMenu" });
    }

    preload() {
        this.load.image("sprBtnPlay", "content\sprBtnPlay.png");
        this.load.image("sprBtnPlayHover", "content\sprBtnPlayHover.png");
        this.load.audio("sndBtn", "content\sndBtn.wav");
    }

    create() {
        this.sfx = {
            btn: this.sound.add("sndBtn")
        };

        this.textTitle = this.add.text(
            this.game.config.width * 0.5,
            64,
            "SPACE SHOOTER",
            {
                fontFamily: "Arcadepix",
                fontSize: 32,
                align: "center"
            }
        );
        this.textTitle.setOrigin(0.5);

        this.btnPlay = this.add.sprite(
            this.game.config.width * 0.5,
            this.game.config.height * 0.5,
            "sprBtnPlay"
        );
        this.btnPlay.setInteractive();

        this.btnPlay.on("pointerover", () => {
            this.btnPlay.setTexture("sprBtnPlayHover");
        });

        this.btnPlay.on("pointerout", () => {
            this.btnPlay.setTexture("sprBtnPlay");
        });

        this.btnPlay.on("pointerdown", () => {
            this.sfx.btn.play();
            this.scene.start("SceneMain");
        });

        this.btnPlay.on("pointerup", () => {
            this.btnPlay.setTexture("sprBtnPlay");
        });
    }
}

class SceneMain extends Phaser.Scene {
    constructor() {
        super({ key: "SceneMain" });
    }

    preload() {
        this.load.image("background", "Week13\content\starfield.png");
        this.load.image("player", "content\player.png");
        this.load.image("bullet", "content\bullet.png");
        this.load.image("enemy", "content\enemy-green.png");
        this.load.spritesheet("explosion", "content\sprExplosion.png", { frameWidth: 128, frameHeight: 128 });
        this.load.audio("explosionSound", "content\sndExplode.wav");
        this.load.audio("laserPlayer", "content\sndLaserPlayer.wav");
    }

    create() {
        this.background = [];
        for (let i = 0; i < 2; i++) {
            let x = config.width * (0.5 + i);
            let y = config.height / 2;
            let bckg = this.add.sprite(x, y, "background");
            this.background.push(bckg);
        }

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.player = this.physics.add.sprite(40, config.height / 2, "player");
        this.player.setCollideWorldBounds(true);
        this.player.fireRate = 200;
        this.player.nextFire = 0;

        this.bullets = this.physics.add.group({
            key: "bullet",
            repeat: 29,
        });
        this.bullets.children.iterate((child) => {
            child.active = false;
        });

        this.enemies = this.physics.add.group();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                let y = Phaser.Math.Between(50, config.height - 50);
                let enemy = this.enemies.create(config.width, y, "enemy");
                enemy.setScale(0.5);
                enemy.setVelocityX(Phaser.Math.Between(-200, -100));
            },
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.bullets, this.enemies, this.destroyEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.gameOver, null, this);

        this.sfx = {
            explosionSound: this.sound.add("explosionSound"),
            laserSound: this.sound.add("laserPlayer"),
        };

        this.anims.create({
            key: "explosion",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 16,
            repeat: 0,
        });
    }

    update() {
        this.background.forEach((bg) => {
            bg.x -= 1;
            if (bg.x < -config.width / 2) {
                bg.x = config.width * 1.5;
            }
        });

        this.player.setVelocity(0, 0);
        if (this.keyW.isDown) this.player.setVelocityY(-160);
        if (this.keyA.isDown) this.player.setVelocityX(-160);
        if (this.keyS.isDown) this.player.setVelocityY(160);
        if (this.keyD.isDown) this.player.setVelocityX(160);

        if (this.keySpace.isDown) {
            if (this.time.now > this.player.nextFire && this.bullets.countActive(false) > 0) {
                this.player.nextFire = this.time.now + this.player.fireRate;
                let bullet = this.bullets.getFirstDead();
                if (bullet) {
                    bullet.active = true;
                    bullet.setPosition(this.player.x + bullet.width, this.player.y);
                    bullet.setVelocityX(160);
                    this.sfx.laserSound.play();
                }
            }
        }

        this.bullets.children.iterate((child) => {
            if (child.active && child.x > config.width) {
                child.active = false;
            }
        });

        this.enemies.children.each((enemy) => {
            if (enemy.x < -enemy.width) {
                this.enemies.remove(enemy);
                enemy.destroy();
            }
        }, this);
    }

    destroyEnemy(bullet, enemy) {
        let explosion = this.add.sprite(enemy.x, enemy.y, "explosion");
        explosion.play("explosion");
        explosion.on("animationcomplete", () => explosion.destroy());

        this.sfx.explosionSound.play();
        enemy.destroy();
        bullet.active = false;
        bullet.setPosition(0, 0);
        bullet.setVelocityX(0);
    }

    gameOver(player, enemy) {
        enemy.destroy();
        this.sfx.explosionSound.play();
        this.scene.start("SceneMainMenu");
    }
}

var config = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    backgroundColor: "black",
    physics: {
      default: "arcade",
      arcade: {
        gravity: {x: 0, y: 0 }
      }
    },
    scene: [
      SceneMainMenu,
      SceneMain
    ],
    pixelArt: true,
    roundPixels: true
};

var game = new Phaser.Game(config);