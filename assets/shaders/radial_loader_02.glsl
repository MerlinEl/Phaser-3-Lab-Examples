---
name: radialMask
type: vertex
author: MerlinEl
---

#ifdef GL_ES
precision mediump float;
#endif

// === VERTEX ===
#define SHADER_VERTEX

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;

varying vec2 fragCoord;
varying vec2 outTexCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);
    outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);
}

---
name: radialMask
type: fragment
author: MerlinEl
uniform.progress: { "type": "1f", "value": 0.0}
---

#define SHADER_FRAGMENT

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  uResolution;
uniform float progress;   // 0.0 – 1.0

varying vec2 fragCoord;

void main(void) {
    vec2 uv = (fragCoord - 0.5 * uResolution) / uResolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    float radius = 0.4;
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
