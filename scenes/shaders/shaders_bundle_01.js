var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.glsl('bundle', '/shaders/bundle2.glsl');
}

function create ()
{
    //  The bundle file contains multiple shaders, all separated by a frontmatter block
    //  You can reference them by name:

    var s1 = this.add.shader('Marble', 0, 0, 400, 600).setOrigin(0);
    var s2 = this.add.shader('Flower Plasma', 400, 0, 400, 600).setOrigin(0);

    // s1.setUniform('size.value', 0.0);
    // s2.setUniform('size.value', 1.0);

    window.s1 = s1;
    window.s2 = s2;

}
