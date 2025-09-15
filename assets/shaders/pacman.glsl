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
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float mouthAngle;   // úhel otevření (radiany)
varying vec2 vUV;
//v1.03
void main(void) {
    // převedeme do rozsahu -1..1 kolem středu
    vec2 uv = vUV * 2.0 - 1.0;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    if (angle < 0.0) angle += 6.2831853; // na rozsah 0..2π

    float alpha = 0.0;
    if (r < 1.0) {
        // vyřízneme klín (ústa)
        if (!(angle > 6.2831853 - mouthAngle || angle < mouthAngle)) {
            alpha = 1.0;
        }
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}
