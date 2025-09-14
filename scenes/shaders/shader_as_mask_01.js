
var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var loaderValue = 0; 

function preload ()
{
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.glsl('wave', '/shaders/shader1.frag.js');
    this.load.glsl('radialMask', '/shaders/radial_mask_01.glsl.js');
    this.load.image('pic', '/images/sao-sinon.png');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.image('myImage',  "/images/timer_bg_01.png");
}

function run1(scene){
    scene.add.image(400, 300, 'bg');

    var shader = scene.make.shader({
        key: 'wave',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });

    //  Make a Bitmap Mask from it
    var mask = shader.createBitmapMask();

    //  Apply the mask to this image
    scene.add.image(400, 300, 'myImage').setMask(mask);
}
function run2(scene){
    // pozadí
    scene.add.image(400, 300, 'bg');

    // vytvoření shaderu
     var shader = scene.make.shader({
        key: 'radialMask',
        x: 400,
        y: 300,
        width: 800,
        height: 600,
        add: false
    });

    // uděláme z něj masku
    var mask = shader.createBitmapMask();

    // aplikujeme na obrázek
    var image = scene.add.image(400, 300, 'myImage').setMask(mask);
console.log("image:", image);
    // nastavíme progress (0.0 - 1.0)
    shader.setUniform('progress.value', 0.5);
    this.shader=shader;
}
function run3(scene){
    this.radialPipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
        game: scene,
        fragShader: `#ifdef GL_ES
        precision mediump float;
        #endif

        uniform sampler2D uTexture;  
        uniform float uProgress;
        varying vec2 outTexCoord;

        void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(outTexCoord, center);
            float radius = uProgress * 0.5;
            float mask = step(dist, radius);
            vec4 color = texture2D(uTexture, outTexCoord);
            gl_FragColor = vec4(color.rgb, color.a * mask);
        }`
    });

    //this.radialPipeline = new RadialMaskPipeline(this.game);
    scene.renderer.pipelines.add('RadialMask', this.radialPipeline);

    let img = scene.add.image(400, 300, 'myImage');
    img.setPipeline('RadialMask');
//this.radialPipeline.setTexture('uTexture', scene.textures.get('myImage'));
    img.pipeline.set1f('uProgress', 0.2);

    // scene.tweens.add({
    //     targets: this.radialPipeline,
    //     uProgress: { value: 1 }, // odkrývá se celý obrázek
    //     duration: 2000,
    //     ease: 'Linear',
    //     onUpdate: () => {
    //         // Pokud chceš plynule měnit (nebo můžeš přímo měnit uProgress.value)
    //     }
    // });
}
function create ()
{
    run1(this);
}
function update(time, delta) {
    // loaderValue roste od 0 do 100
    loaderValue += delta * 0.02; // rychlost růstu
    if (loaderValue > 100) loaderValue = 100;

    // nastav progress do shaderu
    if (this.shader) {
        this.shader.setUniform('progress.value', loaderValue / 100);
    }
}
