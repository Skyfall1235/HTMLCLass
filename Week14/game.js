var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }
        },
        debug: false
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload () {

}

function create () {
    
}

function update () {

}


//2 scenes, a main menu and a game.
//game has 3 things that cycle enddlessly. easy stage, normal stage, bossstage
//easy stage spawns a random amount of enemies
//normal stage spawns more andlasts longer, but gives a power up
//boss stage is bullet hell :)

//requires a high score, and a live system. every time you kill the boss you get 1 extra life

//power ups can be double bullets or shield for 15 sec

//background is balck with scrolling itesm behind the player and enemies
