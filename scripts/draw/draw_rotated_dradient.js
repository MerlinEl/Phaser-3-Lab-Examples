//https://phaser.io/phaser3/devlog/128
//https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2d2d2d",
    parent: "phaser-example",
    scene: {
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

function create() {
    // 1. Create a Graphics object.
    const myGraphics = this.add.graphics();

    // 2. Define the dimensions and angle.
    const width = 200;
    const height = 100;
    const angle = 45;

    // 3. Create a RenderTexture to act as a temporary canvas.
    const rt = this.add.renderTexture(0, 0, width, height);
    const ctx = rt.context;

    // 4. Draw the rotated gradient onto the RenderTexture context.
    const degToRad = (deg) => (deg * Math.PI) / 180;
    const radAngle = degToRad(angle);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(radAngle);

    const gradient = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.5, "#00ff00");
    gradient.addColorStop(1, "#0000ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(-width / 2, -height / 2, width, height);

    ctx.restore();

    // 5. Use the RenderTexture to fill the Graphics object.
    myGraphics.fillStyle(0xffffff);
    myGraphics.fillRect(0, 0, width, height);
    myGraphics.x = 200;
    myGraphics.y = 200;
    myGraphics.angle = angle;
    myGraphics.fillTexture(rt.frame.texture, 0, 0);

    // 6. Destroy the RenderTexture. This is the crucial step!
    rt.destroy();
}

function update() {}
