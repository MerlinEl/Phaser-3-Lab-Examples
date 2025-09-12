var config = {
    type: Phaser.WEBGL,
    parent: "phaser-example",
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
    },
};

var game = new Phaser.Game(config);

function preload() {
    this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
    this.load.glsl("tint_01", "/pipelines/TintPipeline.js");
    this.load.image("timer_bg_01", "/images/timer_bg_01.png");
}

function create() {
    const img = scene.add.image(400, 300, "timer_bg_01");
    const pp = planet.scene.renderer.pipelines.get("TintPipeline");
    img.setPipeline(pp);
    //img.pipelineData = {color: 0xff0000, power: 0.8};

    //this.add.shader('fireball', 400, 300, 800, 600);
}
