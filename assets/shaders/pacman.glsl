---
name: pacman
type: vertex
---

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;
varying vec2 vUV;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    // normalizace na 0..1
    vUV = inPosition / uResolution;
}

---
name: pacman
type: fragment
uniform.mouthAngle { "type": "1f", "value": 0.5 }
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float mouthAngle;   // úhel otevření (radiany)
varying vec2 vUV;
// v1.07
void main(void) {
    // souřadnice -1..1 kolem středu
    vec2 uv = vUV * 2.0 - 1.0;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);     // -PI .. +PI
    if (angle < 0.0) angle += 6.2831853; // 0 .. 2PI

    float alpha = 0.0;

    if (r < 1.0) {
        // Pacman má ústa směrem doprava (osa X)
        // Vyřízneme klín ±mouthAngle kolem 0 rad
        if (angle > mouthAngle && angle < (6.2831853 - mouthAngle)) {
            alpha = 1.0;   // tělo
        } else {
            alpha = 0.0;   // pusa (průhledné)
        }
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
