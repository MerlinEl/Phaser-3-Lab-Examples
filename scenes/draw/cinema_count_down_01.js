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

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.image('timer_image', "/images/timer_bg_01.png");
}

function create() {
    // pozadí
    this.add.image(400, 300, 'bg');

    // obrázek, který budeme maskovat
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

    startTime = this.time.now;
}

function update(time, delta) {
    let elapsed = (time - startTime) / 1000; // v sekundách
    let remaining = Math.ceil(totalSeconds - elapsed);

    graphics.clear();

    if (remaining > 0) {
        // 0 → 360 stupňů během celého odpočtu
        let progress = Phaser.Math.Clamp(elapsed / totalSeconds, 0, 1);
        let angle = Phaser.Math.Linear(0, 360, progress); // CW směr

        graphics.fillStyle(0xffffff);
        graphics.slice(
            400, 300, 300,
            Phaser.Math.DegToRad(-90),                 // začínáme nahoře
            Phaser.Math.DegToRad(angle - 90),          // konec podle progressu
            true
        );
        graphics.fillPath();

        // text nastavíme podle zbývající celé sekundy
        countdownText.setText(remaining);
        countdownText.setVisible(true);
    } else {
        // odpočet dokončen
        countdownText.setVisible(false);
        img.clearMask(true);
    }
}
