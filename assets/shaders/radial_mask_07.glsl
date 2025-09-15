---
name: pacman
type: vertex
---

#ifdef GL_ES
precision mediump float;
#endif

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2  uResolution;
uniform vec2  resolution;      // fallback (někdy Phaser používá jiné jméno)

attribute vec2 inPosition;
varying vec2 fragCoord;

void main(void) {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    // Volba správného resolution (uResolution preferujeme, pokud je nenulové)
    vec2 R = (uResolution.x > 0.0) ? uResolution : resolution;

    // fragCoord v pixelech, stejný prostor jako dříve používal fragment shader
    // flip Y tak, aby 0,0 byl v levém dolním rohu pokud to fragment očekává
    fragCoord = vec2(inPosition.x, R.y - inPosition.y);
}

---
name: pacman
type: fragment
uniform.duration: { "type": "1f", "value": 3000 }   // default 3000 ms
---

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;       // Phaser dodává v sekundách
uniform float duration;   // náš uniform v ms
varying vec2 fragCoord;

void main() {
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);
    if (angle < 0.0) angle += 6.283185307179586;

    // Posun tak, aby začínal nahoře (12:00)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.75);

    // Převod duration → sekundy
    float durSec = duration / 1000.0;

    // 1.0 → 0.0 během zadaného času
    float progress = clamp(1.0 - time / durSec, 0.0, 1.0);

    float radius = 0.4;
    float alpha = 0.0;

    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
}

