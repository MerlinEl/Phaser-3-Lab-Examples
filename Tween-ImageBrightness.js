var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var originalTexture;
var newTexture;

var dude;
var dude2;

function preload() 
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() {
    // get image
    originalTexture = this.textures.get('dude').getSourceImage();
    // clone image with different name
    var newTexture = cloneImage(this, originalTexture, 'dude_new');
    var ctx = cloneGraphics(newTexture, originalTexture);

    dude = this.add.image(100, 100, 'dude');
    dude2 = this.add.image(100, 100, 'dude_new');

    var color = Phaser.Display.Color.IntegerToRGB(0xffffff);
    createSilhouette(ctx, newTexture, color);

    dude2.alpha = 0;
    this.tweens.add({
        targets: dude2,
        alpha:1,
        yoyo: true,
        loop: -1
    });
}

function cloneGraphics(imageTarget, imageSource){

    // get new image ctx
    var ctx = imageTarget.getSourceImage().getContext('2d');
    // draw image on ctx
    ctx.drawImage(imageSource, 0, 0);
    return ctx;
}

function cloneImage(game, image, name){

    return game.textures.createCanvas(name, image.width, image.height);
}

function createSilhouette(ctx, image, color){
    
    var pixels = ctx.getImageData(0, 0, image.width, image.height);
    for (i = 0; i < pixels.data.length / 4; i++) {
        
        processPixel(pixels.data, color, i * 4, 0.1);
    }
    ctx.putImageData(pixels, 0, 0);
}

function processPixel(data, color, index){
    
    data[index] = color.r;
    data[index + 1] = color.g;
    data[index + 2] = color.b;
}