/**
 * @author       MerlinEl <merlin_el@hotmail.com>
 * @copyright    2022
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
 
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
	
	// get drawing context
    var ctx = cloneContext(newTexture, originalTexture);
	
	// add both images to scene at same place
    dude = this.add.image(100, 100, 'dude');
    dude2 = this.add.image(100, 100, 'dude_new');
	
	// draw color on new image
    var color = Phaser.Display.Color.IntegerToRGB(0xffffff);
    createSilhouette(ctx, newTexture, color);
	
	// tween new image alpa
    dude2.alpha = 0;
    this.tweens.add({
        targets: dude2,
        alpha:1,
        yoyo: true,
        loop: -1
    });
}

function cloneContext(imageTarget, imageSource){

    // get drawing context of target image
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