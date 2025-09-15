---
uniform.duration: { "type": "1f", "value": 1000 }
---

precision mediump float;

uniform vec2  resolution;
uniform float time;       // čas v sekundách, Phaser posílá automaticky
uniform float duration;   // v milisekundách
varying vec2 fragCoord;
// v1.06
void main() {
    // Souřadnice kolem středu (−1 .. 1)
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu 0..1, začínáme nahoře (12h)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.75);

    // duration -> sekundy
    float durSec = duration / 1000.0;

    // progress od 1.0 → 0.0 během zadaného času
    float progress = clamp(1.0 - time / durSec, 0.0, 1.0);

    // poloměr pacmana
    float radius = 0.4;
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
