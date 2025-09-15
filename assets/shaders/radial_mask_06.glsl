---
name: pacman
type: vertex
---

precision mediump float;

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 resolution;

attribute vec2 inPosition;

varying vec2 fragCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    // souřadnice obrazovky (0..resolution)
    fragCoord = inPosition;
}

---

name: pacman
type: fragment
---
uniform.duration: { "type": "1f", "value": 3000 }   // default 3s

precision mediump float;

uniform vec2  resolution;
uniform float time;       // Phaser automaticky dodává (v sekundách)
uniform float duration;   // náš uniform v ms
varying vec2 fragCoord;

void main() {
    // Souřadnice kolem středu (-1 .. 1), normalizované podle kratší osy
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu 0..1, posun 0.75 = nahoře (12h)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.75);

    // duration (ms → s)
    float durSec = duration / 1000.0;

    // 1.0 → 0.0 během durSec sekund
    float progress = clamp(1.0 - time / durSec, 0.0, 1.0);

    float radius = 0.4; // velikost pacmana
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    // černý pacman
    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
