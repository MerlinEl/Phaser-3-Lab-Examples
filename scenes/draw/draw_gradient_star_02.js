
class GradientStar extends Phaser.Scene {
    
    constructor () {super(); }
    preload () {
        this.load.script('Matrix2D', 'https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/scripts/geometry/Matrix2D.js');
        this.load.script('Painter2D', 'https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/scripts/geometry/Painter2D.js');
    }
    create() {
        var g = this.add.graphics(new Point2D(800/2, 600/2));
        Painter2D.drawStarRadialGradient(
            g,
            200,
            100,
            [0x003EFF,0x00B700,0xFF003E,0xFEFF00],
            [0,0.34,0.74,1],
            6
        );
    }
    update () {}
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: GradientStar
};

const game = new Phaser.Game(config);
