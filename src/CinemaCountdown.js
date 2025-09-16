class CinemaCountdown extends Phaser.GameObjects.Container {
    running = false;
    constructor(scene, x, y, textureKey, seconds = 3, onComplete = null) {
        super(scene, x, y);

        this.scene = scene;
        this.seconds = seconds;
        this.onComplete = onComplete;
        this.startTime = null; // nastaví se až při start()

        // obrázek
        this.image = scene.add.image(0, 0, textureKey);
        this.add(this.image);

        // graphics pro masku
        this.countdown_graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        this.countdown_mask = this.countdown_graphics.createGeometryMask();

        // křížek
        this.cross = scene.add.graphics();
        this.drawCross(this.cross, this.image.width / 2 - 10);
        this.cross.setAlpha(0.5);
        this.add(this.cross);

        // animace blikání křížku – od začátku pauznutá
        this.crossTween = scene.tweens.add({
            targets: this.cross,
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1,
            paused: true,
        });

        // text odpočtu
        this.countdownText = scene.add
            .text(0, 0, seconds, {
                fontSize: "128px",
                color: "#ffffff",
                fontStyle: "bold",
            })
            .setOrigin(0.5);
        this.add(this.countdownText);

        scene.add.existing(this);
    }

    start() {
        this.startTime = this.scene.time.now;
        this.scene.events.on("update", this.onUpdate, this);
        // Zamaskovat obrázek a kříž
        this.image.setMask(this.countdown_mask);
        this.cross.setMask(this.countdown_mask);
        this.running = true;
        this.crossTween.paused = false; // spustí blikání
    }

    stop() {
        this.running = false;
        this.crossTween.paused = true; // zastaví blikání
        this.scene.events.off("update", this.onUpdate, this);
    }

    reset(seconds = this.seconds) {
        this.stop();
        // Odmaskovat obrázek a kříž
        this.image.mask = null;
        this.cross.mask = null;
        this.image.setVisible(true);
        this.cross.setVisible(true);
        this.countdownText.setVisible(true);
        this.seconds = seconds;
        this.start();
    }

    onUpdate(time, delta) {
        if (!this.running) return;

        let elapsed = (time - this.startTime) / 1000;
        let remaining = Math.ceil(this.seconds - elapsed);

        this.countdown_graphics.clear();

        if (remaining > 0) {
            let progress = Phaser.Math.Clamp(elapsed / this.seconds, 0, 1);
            let angle = Phaser.Math.Linear(0, 360, progress);

            this.countdown_graphics.fillStyle(0xffffff);
            this.countdown_graphics.slice(this.x, this.y, this.image.width / 2, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(angle - 90), true);
            this.countdown_graphics.fillPath();
            this.countdownText.setText(remaining);
        } else {
            this.image.setVisible(false);
            this.countdownText.setVisible(false);
            this.cross.setVisible(false);

            this.stop(); // odregistruje update + zastaví animace

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

    destroy(fromScene) {
        if (this.crossTween) {
            this.crossTween.stop();
            this.crossTween.remove();
        }
        if (this.image) this.image.clearMask(true);
        if (this.cross) this.cross.clearMask(true);

        if (this.countdown_graphics) {
            this.countdown_graphics.destroy();
            this.countdown_graphics = null;
        }
        if (this.countdown_mask) {
            this.countdown_mask.destroy();
            this.countdown_mask = null;
        }
        this.scene.events.off("update", this.onUpdate, this);
        super.destroy(fromScene);
    }
}
