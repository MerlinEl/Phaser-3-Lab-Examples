//https://labs.phaser.io/3.55/index.html?dir=game%20objects/&q=
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
        this.load.image('checker', 'textures/checker.png');
    }

    create ()
    {
        const frag = `
        precision mediump float;

        uniform vec2 resolution;
        uniform sampler2D iChannel0;

        varying vec2 fragCoord;

        void main ()
        {
            vec2 uv = fragCoord / resolution.xy;

            vec4 pixel = texture2D(iChannel0, uv);

            gl_FragColor = vec4(uv.xyx * pixel.rgb, 1.0);
        }
        `;

        const base = new Phaser.Display.BaseShader('simpleTexture', frag);

        const shader = this.add.shader(base, 400, 300, 800, 600, [ 'checker' ]);

        //  Or, set the texture like this:

        // shader.setChannel0('checker');
    }
}

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Example
});
