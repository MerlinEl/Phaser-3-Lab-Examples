precision mediump float;

uniform vec2 resolution;
uniform float time;
varying vec2 fragCoord;
// v1.02
void main() {
    // Souřadnice kolem středu (−1 .. 1)
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu do rozsahu 0.0 .. 1.0
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.75);
    // ^ posun o 0.75 = nahoře (12 hodin)

    // progress od 1.0 → 0.0 během 4 sekund
    float progress = clamp(1.0 - time * 0.25, 0.0, 1.0);

    // poloměr pacmana
    float radius = 0.4;
    float alpha = 0.0;

    // podmínka: uvnitř kruhu a v úhlu menším než progress
    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    // vykreslí černého pacmana
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
