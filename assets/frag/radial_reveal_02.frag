// GLSL Shader code (radial_reveal.frag)
// shader must be on same path
class RadialReveal extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
    constructor(game) {
        super({
            game,
            fragShader: `
            precision mediump float;
            uniform sampler2D uMainTexture; // Původní textura
            uniform float uRadius;          // Poloměr kruhu
            varying vec2 outTexCoord;      // Interpolované souřadnice textury
            void main() {
                vec2 center = vec2(0.5, 0.5); // Střed kruhu (normalizované souřadnice)
                float distance = distance(outTexCoord, center); // Vzdálenost pixelu od středu
            
                vec4 color = texture2D(uMainTexture, outTexCoord); // Barva pixelu
            
                if (distance > uRadius) {
                    // Pokud je pixel mimo kruh, nastavíme průhlednost na 0
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                } else {
                    // Jinak použijeme původní barvu
                    gl_FragColor = color;
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
