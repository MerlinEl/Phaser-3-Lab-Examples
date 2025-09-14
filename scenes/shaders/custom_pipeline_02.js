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
var frag = `
precision mediump float;

uniform sampler2D uMainSampler; // Vstupní textura (obrázek, na který se shader aplikuje)
uniform float uRadius;          // Poloměr kruhu
uniform vec2 uCenter;           // Střed kruhu
uniform vec2 uResolution;      // Rozlišení plátna

varying vec2 outTexCoord;      // Texturové souřadnice

void main() {
    vec2 p = gl_FragCoord.xy - uCenter; // Pozice pixelu vzhledem ke středu
    float dist = length(p);             // Vzdálenost pixelu od středu
    float angle = atan(p.y, p.x);       // Úhel pixelu od středu

    // Převedení úhlu na stupně a normalizace na 0 až 2pi
    // Úhel pro první kvadrant (0 až pi/2)
    if (dist > uRadius || angle < 0.0 || angle > 1.5708) { // 1.5708 = pi/2
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Průhledný pixel
    } else {
        gl_FragColor = texture2D(uMainSampler, outTexCoord); // Vykreslení původního pixelu
    }
}
    `;
var CustomPipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.SinglePipeline,
    initialize:
    function CustomPipeline (game)
    {
        Phaser.Renderer.WebGL.Pipelines.SinglePipeline.call(this, {
            game: game,
            fragShader: frag,
            uniforms: [
                'uMainSampler',
                'uCenter',
                'uResolution',
                'uRadius'
            ]
        });
    }
});

var game = new Phaser.Game(config);

var circle_image;
var time = 0;
var customPipeline;

function preload ()
{
   this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
    this.load.image("timer_bg_01", "/images/timer_bg_01.png");
}

function create ()
{
   customPipeline = this.renderer.pipelines.add('Custom', new CustomPipeline(game));

   customPipeline.set2f('uResolution', 800, 600);
   customPipeline.set2f('uCenter',  400, 300);
   customPipeline.set1f('uRadius',  150);

    circle_image = this.add.sprite(400, 300, 'timer_bg_01').setPipeline('Custom');
  
    this.input.on('pointermove', function (pointer) {
        circle_image.x = pointer.x;
        circle_image.y = pointer.y;
    }, this);

    this.input.on('pointerdown', function (pointer) {

        if (circle_image.pipeline === customPipeline)
        {
            circle_image.resetPipeline();
        }
        else
        {
            circle_image.setPipeline('Custom');
        }

    }, this);
}

function update ()
{
    //customPipeline.set1f('uTime', time);
    //time += 0.05;
}
