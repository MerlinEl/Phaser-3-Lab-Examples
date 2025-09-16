var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
let countdown;

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main');
    this.load.image('bg', '/assets/images/purple-dots.png');
    this.load.image('timer_image', "/assets/images/timer_bg_01.png");
    this.load.script("CinemaCountdown", "/src/CinemaCountdown.js");
}
function create() {
    this.add.image(400, 300, 'bg');

    // varianta A: použiju callback přímo
    countdown = new CinemaCountdown(this, 400, 300, 'timer_image', 3, () => {
        console.log("Odpočet skončil → spusť hru!");
        // např. this.scene.start('GameScene');
    });

    // varianta B: poslouchám událost
    countdown.on("complete", () => {
        console.log("Event complete zachycený!");
    });
}

function update(time, delta) {
    if (countdown) {
        countdown.update(time, delta);
    }
}
