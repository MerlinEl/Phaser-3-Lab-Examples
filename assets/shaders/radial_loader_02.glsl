// Radial Loader Shader (Phaser 3 compatible)

precision mediump float;

// ==== VERTEX SHADER ====
#ifdef VERTEX

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform vec2 uResolution;

attribute vec2 inPosition;

varying vec2 fragCoord;
varying vec2 outTexCoord;

void main () {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);

    // Přepočet souřadnic (Phaser styl)
    fragCoord = vec2(inPosition.x, uResolution.y - inPosition.y);

    outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);
}

#endif

// ==== FRAGMENT SHADER ====
#ifdef FRAGMENT

uniform vec2  uResolution;
uniform float progress;   // 0.0 – 1.0 (stav loaderu)

varying vec2 fragCoord;

void main(void) {
    // Souřadnice kolem středu (normalizované)
    vec2 uv = (fragCoord - 0.5 * uResolution) / uResolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // úhel 0..1 (0 = vpravo, 0.25 = nahoře, 0.5 = vlevo, 0.75 = dole)
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    // Poloměr loaderu
    float radius = 0.4;

    float alpha = 0.0;
    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    // Alfa určuje masku
    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}

#endif
