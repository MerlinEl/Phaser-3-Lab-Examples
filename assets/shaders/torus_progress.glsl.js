precision mediump float;

uniform float uFrac; // Progress (0-1)
uniform sampler2D uAlphaTex; // Alpha mask
uniform vec4 uFillColor; // Fill color
uniform vec4 uBackColor; // Background color
uniform bool uNoAntiAliasing; // Disable anti-aliasing

varying vec2 vUv;

void main() {
    // Výpočet úhlu pomocí atan2, začíná od shora po hodinových ručičkách
    float angle = atan(-1.0 * (vUv.x * 2.0 - 1.0), -1.0 * (vUv.y * 2.0 - 1.0));
    // Převod z -pi..pi na 0..1
    float gradient = (angle / (2.0 * 3.14159265)) + 0.5;

    float gradientDeriv = 0.0;
    float barProgress = 1.0;
    if (uNoAntiAliasing) {
        // Bez anti-aliasingu, ostrý okraj
        gl_FragColor = (uFrac > gradient) ? uFillColor : uBackColor;
    } else {
        // S anti-aliasing
        // Approximate fwidth: v prostředí bez built-in fwidth, použijeme rozdíl UV
        float dx = dFdx(gradient);
        float dy = dFdy(gradient);
        gradientDeriv = length(vec2(dx, dy)) * 1.5;

        barProgress = smoothstep(uFrac, uFrac + gradientDeriv, gradient);
        gl_FragColor = mix(uFillColor, uBackColor, barProgress);
    }

    // Přidání alfa masky
    float alpha = texture2D(uAlphaTex, vUv).a;
    gl_FragColor.a *= alpha;
}
