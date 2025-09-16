var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: "phaser-example",
    scene: {
        preload: preload,
        create: create,
    },
};

var game = new Phaser.Game(config);

function preload() {
    const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
    if (!IS_LOCAL) {
        this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main");
    } else {
        this.load.setBaseURL("..");
    }
    this.load.image("bg", "assets/images/purple-dots.png");
    this.load.image("timer_image", "assets/images/timer_bg_01.png");
    this.load.script("CinemaCountdown", "src/CinemaCountdown.js");
}

function create() {
    this.add.image(400, 300, "bg");

    this.add.text(20, 20, "Klikni pro spuštění...");

    var countdown = new CinemaCountdown(this, 400, 300, "timer_image", 3, () => {
        console.log("Countdown hotovo! 123");
    });

    // kliknutí myší spustí odpočet
    this.input.on("pointerdown", () => {
        countdown.reset(); // odpočet se vždy restartuje
    });
}
