#ifdef GL_ES
precision mediump float;
#endif

uniform float time;        // animace
uniform vec2 resolution;   // velikost plátna

void main(void) {
    // Normalizované souřadnice kolem středu
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float r = length(uv);            // vzdálenost od středu
    float angle = atan(uv.y, uv.x);  // úhel v rozsahu -PI..PI

    // normalizace úhlu na 0..1
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    // "procenta" loaderu (0..1 cyklující podle času)
    float progress = fract(time * 0.2); 

    // Tloušťka prstence
    float inner = 0.3;
    float outer = 0.4;

    // Podmínky: uvnitř prstence a menší úhel než progress
    if (r > inner && r < outer && normAngle < progress) {
        gl_FragColor = vec4(1.0); // bílý loader
    } else {
        gl_FragColor = vec4(0.0); // průhledné/černé pozadí
    }
}
