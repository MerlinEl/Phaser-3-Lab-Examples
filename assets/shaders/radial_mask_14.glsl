---
name: pacman
type: vertex
---

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 resolution;

attribute vec2 inPosition;
varying vec2 fragCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    // posíláme pozici přímo do fragmentu jako pixelové souřadnice
    fragCoord = inPosition;
}

---
name: pacman
type: fragment
uniform.duration: { "type": "1f", "value": 3000 } 
---

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;       // Phaser dodává automaticky (v sekundách)
uniform float duration;   // v ms (nastavíme přes setUniform)
varying vec2 fragCoord;

void main() {
    // Souřadnice kolem středu (-1 .. 1), normalizované podle výšky
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    if (angle < 0.0) angle += 6.283185307179586;

    // Posun tak, aby začínal nahoře (12:00)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.75);

    // duration -> sekundy
    float durSec = duration / 1000.0;

    // progress klesá z 1.0 → 0.0 během durSec sekund
    float progress = clamp(1.0 - time / durSec, 0.0, 1.0);

    float radius = 0.4;
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
