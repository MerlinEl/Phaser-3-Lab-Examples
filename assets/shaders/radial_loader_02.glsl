precision mediump float;

uniform vec2  resolution;
uniform float progress;   // 0.0 – 1.0

void main(void) {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    float radius = 0.4;

    if (r < radius && normAngle < progress) {
         gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}
