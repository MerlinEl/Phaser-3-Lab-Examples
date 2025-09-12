/**
 * Working!
 * https://github.com/phaserjs/phaser/tree/v3.55.2/src/renderer/webgl/pipelines
 * @example
 *  load: AssetLoader.loadPipeline(scene, "TintPipeline");
 *  set uniforms: o.pipelineData = {color: 0xff0000, power: 0.8};
 *  get pipeline: const pp = planet.scene.renderer.pipelines.get("TintPipeline");
 *  apply to object: planet.setPipeline(pp);
 */
class TintPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
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
            }`,
        });

        this._color = new Phaser.Display.Color();
        this._power = 0.5;
    }

    //onBind is called on every game object that contains the pipeline
    // and this is where you set your per object variables.
    onBind(gameObject) {
        super.onBind();
        // console.log(gameObject);
        var pData = gameObject.pipelineData;
        if (!pData) pData = {};
        if (pData.color) this.color = pData.color;
        this.set3f("uTintColor", this._color.redGL, this._color.greenGL, this._color.blueGL);
        this.set1f("uPower", pData.power || this._power);
    }
    //  calling flush during onBatch does something, but makes it work.
    onBatch(gameObject) {
        if (gameObject) {
            this.flush();
        }
    }

    get color() {
        return this._color;
    }

    set color(value) {
        // console.log("TintPipeline > set value:", value);
        if (typeof value === "number") {
            this._color.setFromRGB(Phaser.Display.Color.IntegerToRGB(value));
        } else {
            this._color.setFromRGB(value);
        }
        // console.log("TintPipeline > set color:", this._color);
        return this;
    }
}
