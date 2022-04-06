/**
 * @author       IcyFire <?.com>
 * @copyright    2022
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

function preload() {
    
    this.load.image('lulu', 'assets/pics/shocktroopers-lulu2.png');
}

function create() {

    var lulu1 = this.add.image(400, 300, 'lulu').setScale(1.5);
    var lulu2 = this.add.image(400, 300, 'lulu').setScale(1.5).setTintFill(0xffffff);
    this.tweens.add({
        targets:lulu2,
        alpha:0,
        duaration:2000,
        yoyo:true,
        repeat:-1
    })
}
