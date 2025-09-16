class CinemaCountdown extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textureKey, seconds = 3, onComplete = null) {
        super(scene, x, y);

        this.scene = scene;
        this.seconds = seconds;
        this.startTime = null;
        this.onComplete = onComplete;

        // obrázek, který bude maskovaný
        this.image = scene.add.image(0, 0, textureKey);
        this.add(this.image);

        // graphics pro masku
        this.graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        this.mask = this.graphics.createGeometryMask();
        this.image.setMask(this.mask);

        // křížek – uvnitř obrázku
        this.cross = scene.add.graphics();
        this.drawCross(this.cross, this.image.width / 2 - 10);
        this.cross.setAlpha(0.5);
        this.cross.setMask(this.mask);
        this.add(this.cross);

        // animace blikání křížku
        scene.tweens.add({
            targets: this.cross,
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // text odpočtu (bez masky!)
        this.countdownText = scene.add.text(0, 0, seconds, {
            fontSize: '128px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.countdownText); // přidáme, aby držel pozici, ale masku nemá

        scene.add.existing(this);
        this.startTime = scene.time.now;
    }

    update(time, delta) {
        let elapsed = (time - this.startTime) / 1000;
        let remaining = Math.ceil(this.seconds - elapsed);

        this.graphics.clear();

        if (remaining > 0) {
            let progress = Phaser.Math.Clamp(elapsed / this.seconds, 0, 1);
            let angle = Phaser.Math.Linear(0, 360, progress);

            this.graphics.fillStyle(0xffffff);
            this.graphics.slice(
                this.x, this.y, this.image.width / 2,
                Phaser.Math.DegToRad(-90),
                Phaser.Math.DegToRad(angle - 90),
                true
            );
            this.graphics.fillPath();

            this.countdownText.setText(remaining);
            this.countdownText.setVisible(true);
        } else {
            this.countdownText.setVisible(false);
            this.image.clearMask(true);
            this.cross.clearMask(true);
            this.cross.setVisible(false);

            this.emit("complete");
            if (this.onComplete) {
                this.onComplete();
            }
        }
    }

    drawCross(g, size) {
        g.clear();
        g.lineStyle(4, 0xffffff, 1);
        g.lineBetween(0, -size, 0, size);
        g.lineBetween(-size, 0, size, 0);
    }
}
