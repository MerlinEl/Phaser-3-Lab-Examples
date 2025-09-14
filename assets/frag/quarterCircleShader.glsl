precision mediump float;

uniform sampler2D uMainSampler; // Vstupní textura
uniform float uRadius;          // Poloměr kruhu
uniform vec2 uCenter;           // Střed kruhu
uniform vec2 uResolution;      // Rozlišení plátna

varying vec2 outTexCoord;      // Texturové souřadnice

void main() {
    vec2 p = gl_FragCoord.xy - uCenter;
    float dist = length(p);
    float angle = atan(p.y, p.x);

    // Kontrola, zda je pixel uvnitř čtvrtkruhu v prvním kvadrantu
    // kde úhel je mezi 0 a π/2 (~1.5708)
    if (dist > uRadius || angle < 0.0 || angle > 1.5708) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Průhledný pixel
    } else {
        gl_FragColor = texture2D(uMainSampler, outTexCoord); // Původní barva
    }
}
