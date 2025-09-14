const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

varying vec2 fragCoord;

float avg(vec4 color) {
    return (color.r + color.g + color.b)/3.0;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Flow Speed, increase to make the water flow faster.
    float speed = 1.0;
    
    // Water Scale, scales the water, not the background.
    float scale = 0.8;
    
    // Water opacity, higher opacity means the water reflects more light.
    float opacity = 0.02;
 
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (fragCoord/resolution.xy);
    vec2 scaledUv = uv*scale;

    // Water layers, layered on top of eachother to produce the reflective effect
    // Add 0.1 to both uv vectors to avoid the layers stacking perfectly and creating a huge unnatural highlight
    vec4 water1 = texture2D(iChannel0, scaledUv + time*0.02*speed - 0.1);
    vec4 water2 = texture2D(iChannel0, scaledUv.xy + time*speed*vec2(-0.02, -0.02) + 0.1);
    
    // Water highlights
    vec4 highlights1 = texture2D(iChannel2, scaledUv.xy + time*speed / vec2(-10, 100));
    vec4 highlights2 = texture2D(iChannel2, scaledUv.xy + time*speed / vec2(10, 100));
    
    // Background image
    vec4 background = texture2D(iChannel1, vec2(uv.x, 1.0 - uv.y) + avg(water1) * 0.025);
    
    // Average the colors of the water layers (convert from 1 channel to 4 channel
    water1.rgb = vec3(avg(water1));
    water2.rgb = vec3(avg(water2));
    
    // Average and smooth the colors of the highlight layers
    highlights1.rgb = vec3(avg(highlights1)/1.5);
    highlights2.rgb = vec3(avg(highlights2)/1.5);
    
    float alpha = opacity;
    
    if(avg(water1 + water2) > 0.3) {
        alpha = 0.0;
    }
    
    if(avg(water1 + water2 + highlights1 + highlights2) > 0.75) {
        alpha = 5.0 * opacity;
    }

    // Output to screen
    fragColor = (water1 + water2) * alpha + background;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}
`;

class Example extends Phaser.Scene {
  constructor() {
    super("Example");
  }

  preload() {
    // Use POT (power of two) textures (64x64, 128x128, 512x512, 1024x1024, …).
    this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
    this.load.image("noise", "/textures/noise_01.png");
    this.load.image("pic", "/images/dragon_bg_01.jpg");
    this.load.image("rocks", "/images/rocks_01.png");
    this.load.image("timer_bg_01", "/images/timer_bg_01.png");
  }

  create() {
    // add shader to background
    // this.setBackgrounsShader();

    // add shader on image
    // this.setImageShader();
    this.setImageShader2();

    // console.log("shader:", shader);
    // const img = scene.add.image(400, 300, "timer_bg_01");
    // // how to apply this shader on image?    
  }
  setBackgrounsShader(){
   const baseShader = new Phaser.Display.BaseShader(
      "BufferShader",
      fragmentShader
    );
    var shader = this.add
      .shader(baseShader, 0, 0, 800, 600, ["noise", "pic", "rocks"])
      .setOrigin(0, 0);
  }
  setImageShader(){
    const baseShader = new Phaser.Display.BaseShader("BufferShader", fragmentShader);
    // Vytvoř kontejner pro obrázek, na který chceme aplikovat shader
    const container = this.add.container(400, 300);
    
    // Vytvoř obrázek a přidej ho do kontejneru
    // Pozor: Pozice obrázku je relativní ke kontejneru (0,0)
    const img = this.add.image(0, 0, "timer_bg_01");
    container.add(img);

    // Vytvoř instanci shaderu pro kontejner
    const shader = this.add.shader(baseShader, 0, 0, 800, 600, ["noise", "pic", "rocks"]);

    // Aplikuj shader jako post-pipeline na kontejner
    container.setPostPipeline(shader);

    // Poznámka: Aby shader fungoval, musíš mu předat správné textury (samplery).
    // Ve tvém stávajícím kódu se texture2D používá s `iChannel1` pro background.
    // Pro aplikaci na `timer_bg_01` bys musel upravit shader, aby přijímal správnou texturu
    // a nechal ostatní textury (noise, rocks) jako uniformy.

    // Příklad, jak předat textury do shaderu:
    shader.setSampler2D('iChannel0', this.textures.get('noise').getSourceImage());
    shader.setSampler2D('iChannel1', this.textures.get('timer_bg_01').getSourceImage());
    shader.setSampler2D('iChannel2', this.textures.get('rocks').getSourceImage());

    // Pokud potřebuješ, můžeš nastavit i další uniformy, jako "time" a "resolution"
    this.tweens.add({
        targets: shader,
        time: 1.0, // Změna uniformní proměnné 'time'
        duration: 2000,
        yoyo: true,
        repeat: -1
    });

    console.log("Shader aplikován na obrázek uvnitř kontejneru.");
  }
    setImageShader2(){
        
    }
}

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: Example
};

const game = new Phaser.Game(config);
