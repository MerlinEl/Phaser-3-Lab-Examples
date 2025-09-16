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

let graphics;
let mask;
let img;
let countdownText;

let totalSeconds = 3;
let startTime;
let elapsed = 0;

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.image('timer_image', "/images/timer_bg_01.png");
}

function create() {
    // pozadí
    this.add.image(400, 300, 'bg');

    // obrázek, který maskujeme
    img = this.add.image(400, 300, 'timer_image');

    // graphics pro masku
    graphics = this.make.graphics({x:0, y:0, add:false});
    mask = graphics.createGeometryMask();
    img.setMask(mask);

    // text odpočtu
    countdownText = this.add.text(400, 300, totalSeconds, {
        fontSize: '128px',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    // start čas
    startTime = this.time.now;
}

function update(time, delta) {
    elapsed = (time - startTime) / 1000; // sekundy

    let remaining = Math.ceil(totalSeconds - elapsed);

    graphics.clear();
    if (remaining > 0) {
        // poměr od 1 → 0
        let t = (totalSeconds - elapsed) % 1; 
        let angle = Phaser.Math.Linear(360, 0, 1 - t);

        graphics.fillStyle(0xffffff);
        graphics.slice(400, 300, 300, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(angle - 90), true);
        graphics.fillPath();

        // text nastavíme podle zbývající celé sekundy
        countdownText.setText(remaining);
        countdownText.setVisible(true);
    } else {
        // hotovo -> skryjeme
        countdownText.setVisible(false);
        img.clearMask(true);
    }
}
