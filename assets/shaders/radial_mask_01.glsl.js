#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;  // textury
uniform float uProgress;     // odhalené procento (0..1)
varying vec2 outTexCoord;            // UV koordináty

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(outTexCoord, center); // vzdálenost od středu
    float radius = uProgress * 0.5;      // odhalení od středu do okraje
    float mask = step(dist, radius);     // 1 uvnitř, 0 venku

    vec4 color = texture2D(uTexture, outTexCoord);
    gl_FragColor = vec4(color.rgb, color.a * mask); // průhlednost podle masky
}
