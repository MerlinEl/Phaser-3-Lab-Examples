var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        //mode: Phaser.Scale.NONE,
        parent: 'phaser-example',
        width: 1024,
        height: 1024
    },
    //render: {
    //    pixelArt: true,
    //    antialias: true
    //},
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    var assets_path = "https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets/images"
    this.load.image('pic', assets_path + '/Eva hraje na kytaru.png');
}

function create ()
{
    var img1 = this.add.image(100, 0, 'pic').setOrigin(0);
    var img2 = this.add.image(100, 600, 'pic').setOrigin(0);
    var img3 = this.add.image(100, 900, 'pic').setOrigin(0);
    img2.setScale(.5, .5);
    img3.setScale(.2, .2);

    var tf =  { font: "24px Arial", fill: "#ffffff", align: "center" };
    var txt1 = this.add.text(10, 10, '100% Scale', tf);
    var txt2 = this.add.text(10, 610, '50% Scale', tf);
    var txt3 = this.add.text(10, 910, '20% Scale', tf);
}
