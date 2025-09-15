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

    // normalizované souřadnice 0..1
    vUV = inPosition / uResolution;
}

---
name: pacman
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float mouthAngle;  // velikost úst v radiánech
varying vec2 vUV;

void main(void) {
    // střed obrazovky, -1..1 souřadnice
    vec2 uv = vUV * 2.0 - 1.0;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // normalizace úhlu do -PI..PI
    if (angle < 0.0) {
        angle += 6.2831853;
    }

    float radius = 0.8;
    float alpha = 0.0;

    // podmínky pro Pacman tvar
    if (r < radius) {
        // vyřízneme ústa uprostřed (±mouthAngle)
        if (!(angle > 6.2831853 - mouthAngle || angle < mouthAngle)) {
            alpha = 1.0;
        }
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha); // černý Pacman
}
