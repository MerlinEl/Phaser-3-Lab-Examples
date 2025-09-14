precision mediump float;

uniform vec2  uResolution;
uniform float progress;   // 0.0 – 1.0

void main(void) {
    // Souřadnice kolem středu
    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // úhel 0..1
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    float radius = 0.4;  // velikost kruhu

    float alpha = 0.0;
    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
