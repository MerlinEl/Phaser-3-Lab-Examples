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
    AssetUtils.loadAssets(this, [
        { key: "bg", path: "assets/images/purple-dots.png" },
        { key: "timer_image", path: "assets/images/timer_bg_01.png" },
        { key: "CinemaCountdown", path: "src/CinemaCountdown.js", type: "script" },
    ]);
}

function create() {
    this.add.image(400, 300, "bg");

    this.add.text(20, 20, "Klikni pro spuštění...");

    var countdown = new CinemaCountdown(this, 400, 300, "timer_image", 3, () => {
        console.log("Countdown hotovo! 123");
    });

    // kliknutí myší spustí odpočet
    this.input.once("pointerdown", () => {
        countdown.start();
    });
}
