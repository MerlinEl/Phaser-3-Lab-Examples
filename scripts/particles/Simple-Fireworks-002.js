/**
 * @author       MerlinEl <merlin_el@hotmail.com>
 * @copyright    2022
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var particles;
var emitter;
var margin = 80;
var deathZone;
var frames = ["blue", "green", "red", "white", "yellow"];

function preload () {

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    particles = this.add.particles('flares');
    // define deathZone
    deathZone = new Phaser.Geom.Rectangle(
		margin/2, 
		margin/2, 
		config.width - margin, 
		config.height - margin
	);
    // visualise deathZone
    var r1 = this.add.rectangle(
        deathZone.x + deathZone.width / 2, 
        deathZone.y + deathZone.height / 2, 
        deathZone.width, 
        deathZone.height
    );
    r1.setStrokeStyle(2, 0x1a65ac);
    
    startFireworks();

    this.input.on('pointerdown', function (pointer) {

        var randomColor = frames[Phaser.Math.Between(0, 4)];
        new Firework(deathZone, pointer.x, randomColor);
    })
}

function startFireworks(){

    setInterval(function(){

        var randomColor = frames[Phaser.Math.Between(0, 4)];
        var randomOffsetX = Phaser.Math.Between(deathZone.x, deathZone.x + deathZone.width);
        new Firework(deathZone, randomOffsetX, randomColor);

    }, 500);
}
class Sparks{

    constructor(pos, colorName){

       /* const emitter = this.add.particles(element).createEmitter({
            speed: { min: -400, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: "SCREEN",
            active: false,
            lifespan: 800,
            gravityY: 200,
            alpha: { start: 1, end: 0.7 }
        });
        emitter.explode(80, pointer.x, pointer.y);*/
    }
}
class Firework{
    
    emiter;
    rect;
    constructor(rect, offsetX, colorName){
        
        var randomTop = { start: rect.y + rect.height, end: rect.y, steps: 120 };
        this.emitter = particles.createEmitter({
            frame: colorName,
            radial: false,
            x: offsetX,
            y: randomTop,
            lifespan: 1200,
            speedX: { min: -40, max: 40 }, // tail thickness
            speedY: { min: 200, max: 500 },
            quantity: 2,
            gravity: 200,
            scale: { start: 0.3, end: 0, ease: 'Linear' },
            alpha: { start: 1, end: 0},
            blendMode: 'ADD',
            deathZone: { type: 'onLeave', source: deathZone },
            emitCallback:()=>{

                //console.log("top:" + this.emitter.y.counter + "end:" + this.emitter.y.end)
                if (this.emitter.y.counter <= this.emitter.y.end+10) {
                    
                    this.emitter.stop();
                     //this.emitter.killAll();
                }
            }
        });
    }
}
