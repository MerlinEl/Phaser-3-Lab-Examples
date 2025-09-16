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
    //this.load.glsl('bundle', '/shaders/pacman.glsl');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.glsl('pacman', '/shaders/radial_mask_18.glsl');
}

function create() {
    this.add.image(400, 300, 'bg');
    let pacman = this.add.shader('pacman', 400, 300, 400, 400);
    pacman.setUniform('duration.value', 5000);

    console.log("pacman:",pacman);
    console.log("shader:",pacman.shader);
    console.log("frag:",pacman.shader.fragmentSrc);
    
}

function update(){}
