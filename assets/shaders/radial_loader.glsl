#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
    // Normalizujeme souřadnice od -1 do 1 a posuneme je do středu
    vec2 pos1 = gl_FragCoord.xy / resolution.xy - 0.5;
    
    // Udržujeme poměr stran
    pos1.x *= resolution.x / resolution.y;
    
    // Vypočítáme vzdálenost (r) a úhel (angle)
    float r = length(pos1);
    float angle = atan(pos1.y, pos1.x);

    // Normalizujeme úhel na rozsah od 0 do 2*PI
    angle = mod(angle, 6.28318530718);

    // Vypočítáme animovanou hodnotu (progress)
    float progress = mod(time / 2.0, 1.0) * 6.28318530718;

    // Vytvoříme plný kruh
    float circle = step(r, 0.4);

    // Vytvoříme vnitřní kruh, abychom z kruhu udělali prstenec
    float innerCircle = step(0.3, r);

    // Sestavíme prstenec, který je viditelný jen v rozsahu od 0.3 do 0.4
    float ring = circle * innerCircle;

    // Zkontrolujeme, jestli je úhel (angle) menší než náš progress
    float loadingArc = step(angle, progress);

    // Vykreslíme jen tu část prstence, která odpovídá načítání
    float result = ring * loadingArc;
    
    // Nyní to klíčové: nastavujeme alfa kanál
    // Pokud je "result" 1.0, alfa bude také 1.0 (plně viditelná)
    // Pokud je "result" 0.0, alfa bude také 0.0 (plně průhledná)
    gl_FragColor = vec4(1.0, 1.0, 1.0, result);
}
