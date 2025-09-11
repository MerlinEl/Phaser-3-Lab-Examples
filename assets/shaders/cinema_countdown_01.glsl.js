---
name: cinema_countdown
type: fragment
uniform.uRadius: { "type": "1f", "value": 0.2 }
---

  precision mediump float;

  uniform sampler2D uMainTexture;
  uniform float uRadius;
  uniform vec2 resolution;
  uniform float uTime; // New uniform for time

  varying vec2 outTexCoord;
  void main() {
      vec2 center = vec2(0.5);
      float aspectRatio = resolution.x / resolution.y;
      vec2 aspectCorrectedCoord = vec2(outTexCoord.x, outTexCoord.y / aspectRatio);
      float distance = distance(aspectCorrectedCoord, center);
      
      vec4 texColor = texture2D(uMainTexture, outTexCoord);
      
      float alpha = 1.0 - step(uRadius, distance);
      gl_FragColor = vec4(texColor.rgb, texColor.a * alpha);
  }
