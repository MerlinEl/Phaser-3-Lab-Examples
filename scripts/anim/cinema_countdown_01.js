class CinemaCountdown extends Phaser.Scene {

preload(){
    var assets_path = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets";
    this.load.image('myImage', assets_path + "/images/timer_bg_01.png");
    this.load.glsl('radialReveal',  assets_path + '/frag/radial_reveal.frag'); // Load shader
}

create() {
    const image = this.add.image(400, 300, 'myImage');

    // 1. Shader code
    const shader = this.cache.shader.get('radialReveal');

    // 2. Create geometry
    const sprite = this.add.sprite(0, 0, 'myImage');

    sprite.setOrigin(0, 0);
    sprite.width = image.width
    sprite.height = image.height

    // 3. Create geometry mask
    const postFxPlugin = this.plugins.get('rexPixelationPipelinePlugin').add(sprite, {
        fragSource: shader,
        radius: 0.1,
    });

    //Add image
    image.mask = geometryMask.createGeometryMask();
    // Set image scale (or size)
    // var scale = 0.8
    // image.setScale(scale);

    // 4. Set Animation
    this.input.on('pointerdown', function (pointer) {
        this.tweens.add({
                targets: postFxPlugin,
                props: {
                    radius: 1
                },
                duration: 3000,
            })
        }, this);
    }
}


const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: SimpleStar
};

const game = new Phaser.Game(config);
