precision mediump float;
uniform vec2 resolution;
uniform float time;
varying vec2 fragCoord;

void main(){
    // normalizace do -1..1 (zohledníme poměr stran)
    vec2 p = (2.0 * fragCoord.xy - resolution) / max(resolution.x, resolution.y);

    // ============= DEBUG (odemkni pro ověření souřadnic) =
    // vec3 debugCol = vec3((fragCoord.x / resolution.x), (fragCoord.y / resolution.y), 0.0);
    // gl_FragColor = vec4(debugCol, 1.0);
    // return;

    float r = length(p);

    // úhel 0..2PI (0 = směr doprava)
    float angle = atan(p.y, p.x);       // -PI .. +PI
    if(angle < 0.0) angle += 6.283185307179586;

    // nastavení poloměru Pacmana (měň podle velikosti plochy)
    float radius = 0.6;

    // statický základ úst (v radiánech); drobná animace přes time
    float mouthBase = 0.6; // -> větší = širší pusa
    float mouthAnim = 0.25 * sin(time * 4.0); // animace (nepovinná)
    float mouth = mouthBase + mouthAnim;

    float alpha = 0.0;

    // pokud jsme uvnitř kruhu...
    if(r < radius) {
        // ústa jsou interval < mouth nebo > 2PI-mouth kolem směru 0 (vpravo)
        bool inMouth = (angle < mouth) || (angle > (6.283185307179586 - mouth));

        if(!inMouth) {
            alpha = 1.0; // tělo Pacmana (černé)
        } else {
            alpha = 0.0; // pusa = průhledné
        }
    } else {
        alpha = 0.0; // mimo kruh = průhledné
    }

    gl_FragColor = vec4(vec3(0.0), alpha); // černý Pacman
}
