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

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.glsl('bundle', '/shaders/pacman.glsl');
}

function create() {
    let pacman = this.add.shader('pacman', 400, 300, 400, 400);
    // nastavíme úhel otevřených úst (radiany)
    pacman.setUniform('mouthAngle.value', Math.PI / 6); // cca 30°
}

function update(){}
