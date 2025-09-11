// GLSL Shader code (radial_reveal.frag)
// shader must be on same path
class CinemaCountdown extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
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
        
                float alpha = 1.0 - step(uRadius, distance); // Invert step to reveal
                gl_FragColor = vec4(color.rgb, color.a * alpha);
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
        return this._u_radius;
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
