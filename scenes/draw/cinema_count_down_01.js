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
let maskShape;
let mask;
let img;

let angle = 0;
let countdown = 3;
let nextStepTime = 0;

function preload() {
    this.load.setBaseURL('https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/assets');
    this.load.image('bg', '/images/purple-dots.png');
    this.load.image('timer_image',  "/images/timer_bg_01.png");
}

function create() {
    // pozadí
    this.add.image(400, 300, 'bg');

    // obrázek, který maskujeme
    img = this.add.image(400, 300, 'timer_image');

    // vytvoříme graphics objekt pro kreslení masky
    graphics = this.make.graphics({x:0, y:0, add:false});

    // maska na základě grafiky
    mask = graphics.createGeometryMask();
    img.setMask(mask);

    // text s odpočtem
    this.countdownText = this.add.text(400, 300, countdown, {
        fontSize: '128px',
        color: '#ffffff',
        fontStyle: 'bold'
    }).setOrigin(0.5);

    nextStepTime = this.time.now + 1000; // první změna po 1s
}

function update(time, delta) {
    graphics.clear();

    // nakreslit "koláč" (výseč) který se bude otáčet
    graphics.fillStyle(0xffffff);
    graphics.slice(400, 300, 300, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(angle - 90), true);
    graphics.fillPath();

    // zvětšovat úhel -> roste maska
    angle += 180 * delta / 1000; // 180° za sekundu

    // když uplyne 1s, snížíme countdown
    if (time > nextStepTime) {
        countdown--;
        if (countdown > 0) {
            this.countdownText.setText(countdown);
        } else {
            this.countdownText.setText("GO!");
        }
        nextStepTime = time + 1000;
        angle = 0; // reset úhlu pro další číslo
    }
}
