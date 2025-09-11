#ifdef GL_ES
precision mediump float;
#endif
  
  uniform sampler2D uMainTexture;
  uniform float uRadius;
  uniform vec2 resolution;
  
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
