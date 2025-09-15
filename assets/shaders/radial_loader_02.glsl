---
name: radialMask
type: vertex
author: MerlinEl
---

// VERTEX
#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec2 inPosition;

varying vec2 outTexCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);
    outTexCoord = inPosition / 800.0; // nebo lépe: Phaser ti to už předá jako 0..width
}

---
name: radialMask
type: fragment
author: MerlinEl
uniform.progress: { "type": "1f", "value": 0.0}
---

// FRAGMENT
#ifdef GL_ES
precision mediump float;
#endif

uniform float progress;   // 0.0 – 1.0
varying vec2 outTexCoord;

void main(void) {
    // souřadnice kolem středu [−1..1]
    vec2 uv = outTexCoord * 2.0 - 1.0;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu 0..1 (0 = vpravo)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    float radius = 0.8; // větší kruh
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}

