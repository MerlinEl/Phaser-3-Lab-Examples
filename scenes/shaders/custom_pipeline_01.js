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

    uniform sampler2D uMainSampler;
    uniform vec2 uResolution;
    uniform float uTime;

    varying vec2 outTexCoord;
    varying vec4 outTint;

    vec4 plasma()
    {
        vec2 pixelPos = gl_FragCoord.xy / uResolution * 20.0;
        float freq = 0.8;
        float value =
            sin(uTime + pixelPos.x * freq) +
            sin(uTime + pixelPos.y * freq) +
            sin(uTime + (pixelPos.x + pixelPos.y) * freq) +
            cos(uTime + sqrt(length(pixelPos - 0.5)) * freq * 2.0);

        return vec4(
            cos(value),
            sin(value),
            sin(value * 3.14 * 2.0),
            cos(value)
        );
    }

    void main()
    {
        vec4 texture = texture2D(uMainSampler, outTexCoord);

        texture *= vec4(outTint.rgb * outTint.a, outTint.a);

        gl_FragColor = texture * plasma();
    }
    `
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
                'uResolution',
                'uTime'
            ]
        });
    }
});

var game = new Phaser.Game(config);

var bunny;
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

    customPipeline.set2f('uResolution', game.config.width, game.config.height);

    bunny = this.add.sprite(400, 300, 'timer_bg_01').setPipeline('Custom');
  
    this.input.on('pointermove', function (pointer) {
        bunny.x = pointer.x;
        bunny.y = pointer.y;
    }, this);

    this.input.on('pointerdown', function (pointer) {

        if (bunny.pipeline === customPipeline)
        {
            bunny.resetPipeline();
        }
        else
        {
            bunny.setPipeline('Custom');
        }

    }, this);
}

function update ()
{
    customPipeline.set1f('uTime', time);

    time += 0.05;

    bunny.rotation += 0.01;
}
