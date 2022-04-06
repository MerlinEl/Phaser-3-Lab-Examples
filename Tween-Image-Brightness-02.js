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
var lulu2;

function preload() {
    
    this.load.image('lulu', 'assets/pics/shocktroopers-lulu2.png');
}

function create() {
    // get lulu image
    originalTexture = this.textures.get('lulu').getSourceImage();
    
	// clone image with different name
    var newTexture = cloneImage(this, originalTexture, 'lulu_new');
	
	// get drawing context
    var ctx = getImageContext(newTexture, originalTexture);

	// add new image to scene at same place
    lulu2 = this.add.image(400, 300, 'lulu_new');

    var tween = this.tweens.addCounter({
            duration: 2000,
            onUpdate: function () {
                // progress 0-1
                setBrightness(ctx, originalTexture, 1+this.progress);
            },
            onComplete: function(){

                console.log("Finished with:"+(1+this.progress));
            }
    });

    console.dir(tween)
}

function getImageContext(imageTarget, imageSource){

    // get drawing context of target image
    var ctx = imageTarget.getSourceImage().getContext('2d');
    // draw image on ctx
    ctx.drawImage(imageSource, 0, 0);
    return ctx;
}

function cloneImage(game, image, name){

    return game.textures.createCanvas(name, image.width, image.height);
}

/** @param {number} mul brightness multiplier */
function setBrightness(ctx, image, mul){

    var pixels = ctx.getImageData(0, 0, image.width, image.height);
    var data = pixels.data; // raw pixel data in array
    for(var i = 0; i < data.length; i += 4) {
        
        var red     = data[i];      // Extract original red color [0 to 255]
        var green   = data[i + 1];  // Extract green
        var blue    = data[i + 2];  // Extract blue

        data[i    ] = getValueInRange(red * mul, 0, 255);
        data[i + 1] = getValueInRange(green * mul, 0, 255);
        data[i + 2] = getValueInRange(blue * mul, 0, 255);
    }
    ctx.putImageData(pixels, 0, 0);
}
function getValueInRange(val, min, max){

    return Math.max(min, Math.min(max, val));
}
