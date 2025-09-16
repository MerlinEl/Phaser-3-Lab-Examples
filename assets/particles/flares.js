class Example extends Phaser.Scene {
    preload() {
        this.load.setBaseURL("https://cdn.phaserfiles.com/v385");
        this.load.atlas("flares", "assets/particles/flares.png", "assets/particles/flares.json");
    }

    create() {
        const shape = new Phaser.Geom.Ellipse(0, 0, 200, 100);
        const emitter = this.add.particles(400, 250, "flares", {
            frame: ["red", "yellow", "green"],
            lifespan: 800,
            speed: { min: 50, max: 250 },
            scale: { start: 0.8, end: 0.5 },
            alpha: { start: 1, end: 0 },
            //gravityY: 50,
            blendMode: "ADD",
            // edge-zone
            emitZone: { source: shape },
            emitting: false,
        });

        this.input.on("pointerdown", (pointer) => {
            emitter.setPosition(pointer.position.x, pointer.position.y);
            emitter.explode(32);
        });

        this.add.text(10, 10, "Click to explode emit particles");
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000",
    parent: "phaser-example",
    scene: Example,
};

const game = new Phaser.Game(config);
