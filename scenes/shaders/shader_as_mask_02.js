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
var shader;
var loaderValue = 0;

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.glsl('radialMask', '/shaders/radial_loader_02.glsl');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.image('myImage', '/images/timer_bg_01.png');
}

function create() {
    this.add.image(400, 300, 'bg');

    var shader = this.make.shader({
        key: 'radialMask',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });

    // nastavíme uResolution ručně
    shader.setUniform('uResolution.value', [800, 600]);
    shader.setUniform('progress.value', 0.0);

    var mask = shader.createBitmapMask();
    this.add.image(400, 300, 'myImage').setMask(mask);

    this.shader = shader;
}

function update(time, delta) {
    loaderValue += delta * 0.02;
    if (loaderValue > 100) loaderValue = 100;

    if (this.shader) {
        this.shader.setUniform('progress.value', loaderValue / 100);
    }
}
