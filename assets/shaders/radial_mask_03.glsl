precision mediump float;

uniform vec2 resolution;
uniform float time;
varying vec2 fragCoord;

void main() {
    // souřadnice kolem středu obrazovky (−1 .. 1)
    vec2 uv = (2.0 * fragCoord - resolution) / resolution.y;

    float r = length(uv);
    float angle = atan(uv.y, uv.x); 

    // normalizace úhlu do rozsahu 0.0 .. 1.0
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    // progress – roste od 0 do 1 každé 4 sekundy
    float progress = mod(time * 0.25, 1.0);

    // radius pacmana
    float radius = 0.4;
    float alpha = 0.0;

    // kreslíme výseč podle progress
    if (r < radius && normAngle < progress) {
        alpha = 1.0;
    }

    gl_FragColor = vec4(0.0, 0.0, 0.0, alpha); // černý pacman
}
