precision mediump float;

uniform vec2  resolution;  // Phaser automaticky dodá
uniform float progress;     // náš vlastní uniform (0.0–1.0)

void main(void) {
    // Normalizované souřadnice kolem středu
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu na 0..1
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    // Tloušťka prstence
    float inner = 0.3;
    float outer = 0.4;

    float alpha = 0.0;
    if (r > inner && r < outer && normAngle < progress) {
        alpha = 1.0;
    }

    // RGB může být libovolné, maska používá alfu
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
