var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        //mode: Phaser.Scale.NONE,
        parent: 'phaser-example',
        width: 1024,
        height: 1024
    },
    //render: {
    //    pixelArt: true,
    //    antialias: true
    //},
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    var assets_path = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets/images"
    this.load.image('pic', assets_path + '/Eva hraje na kytaru.png');
}

function create ()
{
    var img1 = this.add.image(100, 0, 'pic').setOrigin(0);
    var img2 = this.add.image(100, 600, 'pic').setOrigin(0);
    var img3 = this.add.image(100, 900, 'pic').setOrigin(0);
    img2.setScale(.5, .5);
    img3.setScale(.2, .2);

    var tf =  { font: "24px Arial", fill: "#ffffff", align: "center" };
    var txt1 = this.add.text(10, 10, '100% Scale', tf);
    var txt2 = this.add.text(10, 610, '50% Scale', tf);
    var txt3 = this.add.text(10, 910, '20% Scale', tf);
}


/**
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/

------------------
Full screen
------------------
Under 'pointerup' touch event :

Start full screen

scene.scale.startFullscreen();
Stop full screen

scene.scale.stopFullscreen();
Toggle full screen

scene.scale.toggleFullscreen();
Is full screen

var isFullscreen = scene.scale.isFullscreen;

------------------
Enter full screen
------------------
scene.scale.on('enterfullscreen', function() {}, scope);
Enter full screen failed

scene.scale.on('fullscreenfailed', function(error) {}, scope);
Leave full screen

scene.scale.on('leavefullscreen', function() {}, scope);
Full screen unsupport

scene.scale.on('fullscreenunsupported', function() {}, scope);
Leave full screen

scene.scale.on('leavefullscreen', function() {}, scope);

------------------
Orientation
------------------
scene.scale.on('orientationchange', function(orientation) {
    if (orientation === Phaser.Scale.PORTRAIT) {

    } else if (orientation === Phaser.Scale.LANDSCAPE) {

    }
}, scope);

------------------
Setup
------------------
 * @typedef {object} Phaser.Types.Core.RenderConfig
 * @since 3.0.0
 *
 * @property {boolean} [antialias=true] - When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
 * @property {boolean} [desynchronized=false] - When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
 * @property {boolean} [pixelArt=false] - Sets `antialias` and `roundPixels` to true. This is the best setting for pixel-art games.
 * @property {boolean} [roundPixels=false] - Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
 * @property {boolean} [transparent=false] - Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
 * @property {boolean} [clearBeforeRender=true] - Whether the game canvas will be cleared between each rendering frame.
 * @property {boolean} [premultipliedAlpha=true] - In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
 * @property {boolean} [failIfMajorPerformanceCaveat=false] - Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
 * @property {string} [powerPreference='default'] - "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
 * @property {integer} [batchSize=2000] - The default WebGL batch size.
 * @property {integer} [maxLights=10] - The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
 */
