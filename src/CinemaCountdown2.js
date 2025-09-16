class CinemaCountdown extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textureKey, seconds = 3, onComplete = null, autoDestroy = true) {
        super(scene, x, y);

        this.scene = scene;
        this.seconds = seconds;
        this.onComplete = onComplete;
        this.autoDestroy = autoDestroy;
        this.startTime = scene.time.now;

        // obrázek
        this.image = scene.add.image(0, 0, textureKey);
        this.add(this.image);

        // graphics pro masku
        this.countdown_graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        this.countdown_mask = this.countdown_graphics.createGeometryMask();
        this.image.setMask(this.countdown_mask);

        // křížek
        this.cross = scene.add.graphics();
        this.drawCross(this.cross, this.image.width / 2 - 10);
        this.cross.setAlpha(0.5);
        this.cross.setMask(this.countdown_mask);
        this.add(this.cross);

        // animace blikání křížku
        this.crossTween = scene.tweens.add({
            targets: this.cross,
            alpha: { from: 0.5, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // text odpočtu (bez masky)
        this.countdownText = scene.add.text(0, 0, seconds, {
            fontSize: '128px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add(this.countdownText);

        // registrace na update loop scény
        scene.events.on('update', this.onUpdate, this);

        scene.add.existing(this);
    }

    onUpdate(time, delta) {
        let elapsed = (time - this.startTime) / 1000;
        let remaining = Math.ceil(this.seconds - elapsed);

        this.countdown_graphics.clear();

        if (remaining > 0) {
            let progress = Phaser.Math.Clamp(elapsed / this.seconds, 0, 1);
            let angle = Phaser.Math.Linear(0, 360, progress);

            this.countdown_graphics.fillStyle(0xffffff);
            this.countdown_graphics.slice(
                this.x, this.y, this.image.width / 2,
                Phaser.Math.DegToRad(-90),
                Phaser.Math.DegToRad(angle - 90),
                true
            );
            this.countdown_graphics.fillPath();

            this.countdownText.setText(remaining);
            this.countdownText.setVisible(true);
        } else {
            this.countdownText.setVisible(false);
            this.image.clearMask(true);
            this.cross.clearMask(true);
            this.cross.setVisible(false);

            // odregistrovat update
            this.scene.events.off('update', this.onUpdate, this);

            this.emit("complete");
            if (this.onComplete) {
                this.onComplete();
            }

            if (this.autoDestroy) {
                this.destroy();
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

        this.scene.events.off('update', this.onUpdate, this);

        super.destroy(fromScene);
    }
}
