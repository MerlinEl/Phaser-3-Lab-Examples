// GLSL Shader code (radial_reveal.frag)
// shader must be on same path
class RadialReveal extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
            precision mediump float;
            uniform sampler2D uMainTexture;
            uniform float uRadius;
            uniform vec2 uResolution;
            
            varying vec2 outTexCoord;
            
            void main() {
                vec2 center = vec2(0.5, 0.5);
                float aspectRatio = uResolution.x / uResolution.y;
                vec2 aspectCorrectedCoord = vec2(outTexCoord.x, outTexCoord.y * aspectRatio);
                float distance = distance(aspectCorrectedCoord, center);
            
                vec4 color = texture2D(uMainTexture, outTexCoord);
            
                // 1. Aplikace radiálního odhalování
                float alpha = smoothstep(uRadius - 0.05, uRadius + 0.05, distance); // Hladký přechod
                // float alpha = (distance < uRadius) ? 1.0 : 0.0; // Původní ostrý přechod
            
                // 2. Oříznutí do kruhu
                if (distance > 0.5) { // Ořízneme vše mimo kruh o poloměru 0.5
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Průhledná barva
                } else {
                    gl_FragColor = vec4(color.rgb, color.a * alpha); // Použijeme původní barvu s upravenou průhledností
                }
            }`,
        });
        this._u_radius = 0.5;
        this._u_size = {width:100, height:100};
    }
    onPreRender() {
        this.set2f('uResolution', this._u_size.width, this._u_size.height);
        this.set1f('uRadius', this._u_radius);
    }
    get radius() {
        return this._color;
    }
    set radius (val){
        this._u_radius = val;
    }
    get size(){
        return this._u_size;
    }
    set size(val){
        this._u_size = val;
    }
}
