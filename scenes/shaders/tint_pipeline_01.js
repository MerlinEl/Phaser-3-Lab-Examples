class TintImageShader_Scene extends Phaser.Scene {
    frag_tint = `
    #define SHADER_NAME COLORBLEND
    precision mediump float;
    uniform vec3 uTintColor;
    uniform float uPower;
    uniform sampler2D uMainSampler;
    varying vec2 outTexCoord;
    void main(){
        vec4 inputColor = texture2D( uMainSampler, outTexCoord );
        // discard transparent area
        if (inputColor.a < 0.1) discard;

        // Get pixel color
        vec3 base = inputColor.xyz;

        // Blend the color with base
        //vec3 newColor =  base * uPower + uTintColor * (1.0 - uPower);
        vec3 newColor = mix(base, uTintColor, uPower); 

        // Return new color
        gl_FragColor = vec4(newColor, 1.0);
    }`

    preload() {
        this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
        this.load.script("tint_pp_01", "/pipelines/TintPipeline.js");
        this.load.image("timer_bg_01", "/images/timer_bg_01.png");
    }

    create() {

         this.fromPipelineFile(this);
        // this.fromFrag(this);
        // this.tintBackground();
    }

    update(time, delta) {}

    tintBackground(){

        const base = new Phaser.Display.BaseShader(
            'tint_background',
            this.frag_tint,
            null,
            {
                uPower: { type: '1f', value: 0.2 },
                uTintColor: { type: '3f', value: {x:1, y:0, z:0} },
            }
        );

        const shader = this.add.shader(base, 400, 300, 800, 600, [ 'logo' ]);

        shader.setUniform('uPower.value', 0.2);
        var color = Phaser.Display.Color.HexStringToColor("#00ff00");
        shader.setUniform("uTintColor.value", {x:color.redGL, y:color.greenGL, z:color.blueGL});

        console.log(shader);

        this.tweens.add({
            targets: shader.uniforms.uPower,
            value: 0.8 ,
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    // This example fail to show shader result after is applyed. No errors.
    // We try to load fragment shader from a string and apply it on a image
    fromFrag(scene){
        const pipeline = new Phaser.Renderer.WebGL.Pipelines.SinglePipeline({
            game: scene,
            // renderer: scene.renderer,
            name: 'TintPipeline',
            fragSource:this.frag_tint,
            uniforms: {
                uPower: { type: '1f', value: 0.2 },
                uTintColor: { type: '3f', value: {x:1, y:0, z:0} },
            },  
            // onBind:function(gameObject) {
            //     console.log("gameObject:", gameObject);
            //     const data = gameObject.pipelineData;
            //     //this.set1f('uDyePaletteIndex', Math.floor(Math.random() * 72));
            // }
        });

        console.log("pipeline:", pipeline);
        //scene.renderer.pipelines.add("TintPipeline", pipeline);

        const img = scene.add.image(400, 300, "timer_bg_01");
        const pp = scene.renderer.pipelines.get("TintPipeline");
        img.setPipeline(pp);
        img.pipelineData = {uTintColor: 0xff0000, uPower: 0.7};
                console.log("img:", img, "shader:", img.pipeline.currentShader);
    img.pipeline.currentShader.set1f("uPower", 0.7)
    // img.pipeline.currentShader.createUniforms();
        console.log("img:", img,);

        // var color = Phaser.Display.Color.HexStringToColor("#00ff00");
        // img.pipeline.set3f("uTintColor", color.redGL, color.greenGL, color.blueGL);
        // img.pipeline.set1f('uPower', 0.7);

    }
    // This is a working example when pipeline is loaded from a file.
    fromPipelineFile(scene){
        // create new pipeline from script class
        var pipeline = new TintPipeline(this);
        if (!pipeline) return false;
        // add pipeline into collection
        scene.renderer.pipelines.add("TintPipeline", pipeline);

        // get pipeline by name
        const pp = scene.renderer.pipelines.get("TintPipeline");
        console.log("pp:",pp)

        // add image 
        const img = scene.add.image(400, 300, "timer_bg_01");
        // apply pipeline on image
        img.setPipeline(pp);
        // change pipeline parameters
        img.pipelineData = {color: 0xff0000, power: 0.1};
        console.log("data:", img.pipelineData);

        this.tweens.add({
            targets: img.pipelineData,
            power: 0.8, //{from:0, to:0.8},
            duration: 1000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }
}


const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: TintImageShader_Scene,
    backgroundColor: '#3498db'
};

const game = new Phaser.Game(config);
