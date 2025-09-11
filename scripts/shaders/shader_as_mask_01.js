var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.glsl('wave', '/shaders/shader1.frag.js');
    this.load.image('pic', '/images/sao-sinon.png');
    this.load.image('bg', '/images/purple-dots.png');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var shader = this.make.shader({
        key: 'wave',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });

    //  Make a Bitmap Mask from it
    var mask = shader.createBitmapMask();

    //  Apply the mask to this image
    this.add.image(400, 300, 'pic').setMask(mask);
}
