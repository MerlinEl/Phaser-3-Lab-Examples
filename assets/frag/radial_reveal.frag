// GLSL Shader code (radial_reveal.frag)
// shader must be on same path
const RadialRevealFrag = `
precision mediump float;

uniform sampler2D uMainTexture; // Původní textura
uniform float uRadius;          // Poloměr kruhu

varying vec2 outTexCoord;      // Interpolované souřadnice textury

void main() {
    vec2 center = vec2(0.5, 0.5); // Střed kruhu (normalizované souřadnice)
    float distance = distance(outTexCoord, center); // Vzdálenost pixelu od středu

    vec4 color = texture2D(uMainTexture, outTexCoord); // Barva pixelu

    if (distance > uRadius) {
        // Pokud je pixel mimo kruh, nastavíme průhlednost na 0
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    } else {
        // Jinak použijeme původní barvu
        gl_FragColor = color;
    }
}
`;
