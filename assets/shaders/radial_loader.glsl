#ifdef GL_ES
precision mediump float;
#endif

uniform float progress;    // 0.0 - 1.0 (stav načítání)
uniform vec2 resolution;   // velikost plátna

void main(void) {
    // Normalizované souřadnice kolem středu
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float r = length(uv);            // vzdálenost od středu
    float angle = atan(uv.y, uv.x);  // úhel v rozsahu -PI..PI

    // normalizace úhlu na 0..1
    float normAngle = fract(angle / (2.0 * 3.14159265) + 0.5);

    // Tloušťka prstence
    float inner = 0.3;
    float outer = 0.4;

    // Podmínky: uvnitř prstence a menší úhel než progress
    if (r > inner && r < outer && normAngle < progress) {
        gl_FragColor = vec4(1.0); // bílý viditelný kus loaderu
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // průhledné pozadí (pro masku)
    }
}
