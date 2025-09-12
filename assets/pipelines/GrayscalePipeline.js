/**
 * Working!
 * https://github.com/phaserjs/phaser/tree/v3.55.2/src/renderer/webgl/pipelines
 * https://www.shadertoy.com/
 * 
 * @source https://www.shadertoy.com/view/lsf3WH
 * https://labs.phaser.io/edit.html?src=src/renderer\set%20pipeline%20data.js
 * https://labs.phaser.io/edit.html?src=src/renderer\grayscale%20pipeline%20added%20locally.js
 *
 * new Phaser 3 version
 * https://labs.phaser.io/edit.html?src=src/fx%5Ccolormatrix%5Ccolormatrix%20fx.js
 * 
 * @example
 *  load: AssetLoader.loadPipeline(scene, "GrayScalePipeline");
 *  if need new instance: var grayscalePipeline = game.renderer.pipelines.add(filterName, new GrayScalePipeline(game));
 *  setup: grayscalePipeline.gray = 1; // 0 == colored
 *  apply to object: o.setPipeline(grayscalePipeline);
 *  apply to object: o.setPipeline(grayscalePipeline, { gray: 1 }); // gray assignment not works, must be set on pipeline (setup)
 *  animated:
    scene.tweens.add({
        targets: grayscalePipeline,
        delay: 1000,
        repeatDelay: 1000,
        gray: 0,
        yoyo: true,
        repeat: -1,
    });
    OR
    // load grayscale pipeline
    AssetLoader.loadPipeline(scene, "GrayScalePipeline");
    // wait for pipeline is loaded
        var lesson = this;
        setTimeout(() => {
             // create shader instance
             const grayscalePipeline = lesson.scene.renderer.pipelines.get("GrayScalePipeline");
             // set gray value
             grayscalePipeline.gray = 0.4;
             // apply shader
             card.grayscaleFx = card.bg_skin_01.setPipeline(grayscalePipeline);
    }, 200);
    // remove shader
    card.grayscaleFx.resetPipeline();
 */
class GrayScalePipeline extends Phaser.Renderer.WebGL.Pipelines.MultiPipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
            #define SHADER_NAME GRAYSCALE
            precision mediump float;
            uniform sampler2D uMainSampler[%count%];
            uniform float gray;
            varying vec2 outTexCoord;
            varying float outTexId;
            varying vec4 outTint;
            varying vec2 fragCoord;
            void main(){
                
                vec4 texture;
                %forloop%
                gl_FragColor = texture;
                gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);
            }
            `,
            uniforms: ["uProjectionMatrix", "uMainSampler", "gray"],
        });

        this._gray = 1;
    }

    onPreRender() {
        this.set1f("gray", this._gray);
    }

    get gray() {
        return this._gray;
    }

    set gray(value) {
        this._gray = value;
    }
}

/**
 * Grayscale pipeline
 * @source https://www.shadertoy.com/view/lsf3WH
 * @preload
 * this.load.script("GrayscalePipeline", 'assets/filters/GrayscalePipeline.js');
 * or
 * AssetLoader.loadPipeline(this, "GrayscalePipeline");
 * @create
 * this.grayscalePipeline = this.game.renderer.pipelines.add('Grayscale', new GrayscalePipeline(this.game));
 * go.setPipeline('Grayscale');
 * @update
 * this.grayscalePipeline.time += 0.01;
 * */
/*var GrayscalePipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline,
    initialize:
        function GrayscalePipeline(game) {
            Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline.call(this, {
                game: game,
                renderer: game.renderer,
                fragShader: `
            precision mediump float;
            uniform sampler2D uMainSampler;
            varying vec2 outTexCoord;
            void main(void) {
                vec4 color = texture2D(uMainSampler, outTexCoord);
                float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                if (color.a < 0.5) discard; // discard transparent pixels
                    gl_FragColor = vec4(vec3(gray), 1.0);
            }`
            });
        }
});



const GrayScalePipeline = new Phaser.Class({
    Extends: Phaser.Renderer.WebGL.Pipelines.MultiPipeline, //TextureTintPipeline
    initialize: function GrayScalePipeline(game) {
        Phaser.Renderer.WebGL.Pipelines.MultiPipeline.call(this, {
            game: game,
            renderer: game.renderer,
            fragShader: `
            #define SHADER_NAME GRAYSCALE
            precision mediump float;
            uniform sampler2D uMainSampler[%count%];
            uniform float gray;
            varying vec2 outTexCoord;
            varying float outTexId;
            varying vec4 outTint;
            varying vec2 fragCoord;
            void main()
            {
                vec4 texture;
        
                %forloop%
        
                gl_FragColor = texture;
                gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126 * gl_FragColor.r + 0.7152 * gl_FragColor.g + 0.0722 * gl_FragColor.b), gray);
            }
            `,
        });
    },
});
*/
