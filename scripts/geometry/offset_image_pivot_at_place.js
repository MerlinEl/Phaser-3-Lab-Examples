class Example extends Phaser.Scene
{
    image4;
    image3;
    image2;
    image1;

    preload ()
    {
        this.load.setBaseURL('https://cdn.phaserfiles.com/v385');
        this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
        this.load.image('atari', 'assets/sprites/atari130xe.png');
    }

    create ()
    {

        this.add.image(0, 0, 'grid').setOrigin(0);

        var positions = [
            {x:200, y:320},
            {x:400, y:320},
            {x:600, y:320},
            {x:800, y:320}
        ]

        var origins = [
            {x:0.5, y:0.5},// default origin is 0.5 = the center
            {x:0, y:0},
            {x:0.25, y:0.75},
            {x:1, y:1}
        ]

        var images = ["image1","image2","image3","image4"];

        // Draw initial position and bounds of each image
        let graphics = this.make.graphics({add:true});
        graphics.fillStyle(0xff0000, 1);
        graphics.lineStyle(1,0xff0000);
        images.forEach((img_name, i)=> {
            // fill vars
            var p = positions[i];
            var o = origins[i];
            // add each image to scene
            var img = this[img_name] = this.add.image(p.x, p.y, 'atari');
            // offset origin
            this.offsetOriginAtPlace(img, o);
            // draw center
            //graphics.fillRect(p.x-10, p.y-10, 20, 20);
            // draw origin
            var w = img.width;
            var h = img.height;
            graphics.fillRect(p.x - w /2 + (w*o.x)-10, p.y - h / 2 + (h*o.y)-10, 20, 20);
            // draw bounds
            graphics.strokeRect(p.x-w/2, p.y-h/2, w, h);

        });
        graphics.depth = 1000;
    }

    offsetOriginAtPlace(img, origin){

        img.setOrigin(origin.x, origin.y);
        var centerOffset = {w:img.width * origin.x, h:img.height * origin.y};
        img.x -= img.width / 2 - centerOffset.w;
        img.y -= img.height / 2 - centerOffset.h;
    }

    update ()
    {
        this.image1.rotation += 0.01;
        this.image2.rotation += 0.01;
        this.image3.rotation += 0.01;
        this.image4.rotation += 0.01;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
