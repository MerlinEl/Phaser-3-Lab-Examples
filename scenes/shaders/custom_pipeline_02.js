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
var frag1 = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform float time;
    uniform vec2 resolution;

    void main( void ) {
        vec2 pos1=gl_FragCoord.xy/resolution.x-vec2(0.50,resolution.y/resolution.x/2.0);
        float l1=length(pos1);
        float l2=step(0.5,fract(1.0/l1+time/1.8));
        float a=step(0.5,fract(0.1*sin(20.*l1+time*1.)/l1+atan(pos1.x,pos1.y)*3.));
        if(a!=l2 && l1>0.05){
            gl_FragColor=vec4(1.0,1.0,1.0,1.0);
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
            fragShader: frag1,
            uniforms: [
                'uProjectionMatrix',
                'uViewMatrix',
                'uModelMatrix',
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
