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

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
	deathZone = new Phaser.Geom.Rectangle(
		margin/2, 
		margin/2, 
		config.width - this.margin, 
		config.height - this.margin
	);
}

function create ()
{
    particles = this.add.particles('flares');
    launchFirework();
}
function launchFirework(){

    var margin = 80;
    var randomColor = ['red', 'green', 'blue', 'white', 'yellow'][Phaser.Math.Between(0, 4)];
    var randomOffsetX = Phaser.Math.Between(margin, config.width - margin);
    emitter = particles.createEmitter({
        frame: randomColor,
        radial: false,
        x: randomOffsetX,
        y: { start: config.height - margin, end: margin, steps: 120 },
        lifespan: 1200,
        speedX: { min: -40, max: 40 }, // tail thickness
        speedY: { min: 200, max: 600 },
        quantity: 2,
        gravity: 200,
        scale: { start: 0.3, end: 0, ease: 'Power3' },
        blendMode: 'ADD',
		deathZone: { type: 'onLeave', source: deathZone },
		emitCallback:()=>{

			// Ctrace("update firework y:{0} top:{1}", this.emitter.y.counter, randomTop.end)
			if (emitter.y.counter < emitter.y.end*2) {
				
				emitter.stop();
			}
		}
    });
}