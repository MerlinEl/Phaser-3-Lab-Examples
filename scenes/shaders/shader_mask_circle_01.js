var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var circle_image;
var time = 0;

function preload ()
{
    this.load.setBaseURL("https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets");
    this.load.image("logo", "/images/timer_bg_01.png");
    this.load.glsl('quarterCircleShader', '/shaders/quarterCircleShader.glsl');
}

function create ()
{
    const screenWidth = this.sys.game.config.width;
    const screenHeight = this.sys.game.config.height;

    // Vytvoří obrázek, na který aplikujeme shader
    const logo = this.add.image(screenWidth / 2, screenHeight / 2, 'logo');

    // Vytvoří shader a aplikuje ho na kameru
    const shader = this.add.shader('quarterCircleShader', 0, 0, screenWidth, screenHeight);
    
    // Shader musí být interaktivní, aby mohl přijímat uniformní proměnné
    // Dříve se uniformy nastavovaly přes "setUniform". Nyní přes "set1f", "set2f", atd.
    shader.setInteractive();

    // Nastavení uniforms pomocí nových metod
    shader.set2f('uResolution', screenWidth, screenHeight);
    shader.set2f('uCenter', logo.x, logo.y);
    shader.set1f('uRadius', 150);
    
    // Upozornění: Pro jednoduché maskování celého objektu (sprite)
    // je obecně jednodušší použít vestavěné masky, jak bylo ukázáno dříve.
    // Shader by se pak aplikoval na Container nebo Camera.
    
    // Příklad, jak aplikovat shader jako post-processing filtr na celou scénu:
    //this.cameras.main.setPostPipeline(shader);

    // Nebo, jak ho aplikovat na konkrétní objekt (novější verze Phaseru to zjednodušily)
    logo.setPipeline(shader);
}

function update (){
    //customPipeline.set1f('uTime', time);
    //time += 0.05;
}
