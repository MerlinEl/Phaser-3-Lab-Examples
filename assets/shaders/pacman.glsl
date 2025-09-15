---
name: pacman
type: vertex
---

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

attribute vec2 inPosition;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);
}

---
name: pacman
type: fragment
---

#ifdef GL_ES
precision mediump float;
#endif

uniform float mouthAngle; // úhel "úst" v radiánech
uniform vec2  uResolution; // velikost shader plochy (např. 400x400)
// version 0.01
void main(void) {
    // souřadnice pixelu v rozsahu -1..1 kolem středu
    vec2 uv = (gl_FragCoord.xy / uResolution) * 2.0 - 1.0;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    if (angle < 0.0) angle += 6.2831853; // převedeme na 0..2π

    float radius = 0.8;
    float alpha = 0.0;

    if (r < radius) {
        // vyřízneme "ústa" podle mouthAngle
        if (!(angle > 6.2831853 - mouthAngle || angle < mouthAngle)) {
            alpha = 1.0;
        }
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha); // černý pacman
}
