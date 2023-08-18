class SimpleStar extends Phaser.Scene {
    
    create() {
        var g = this.make.graphics({x: 0, y: 0, add: false});
        this.drawStar(g, {x:105, y:105},  5, 100, 50, 0xFFFF00, 0xFF0000, 5);
        g.generateTexture('starGraphics', 210, 210);
        var image = this.add.image(400, 300, 'starGraphics');
    }

    drawStar (g, center, spikes, outerRadius, innerRadius, fillColor, lineColor, lineWidth) {
        var rot = (Math.PI / 2) * 3;
        var x = center.x;
        var y = center.y;
        var step = Math.PI / spikes;
        if (lineColor != null) g.lineStyle(lineWidth, lineColor, 1.0);
        g.fillStyle(fillColor, 1.0);
        g.beginPath();
        g.moveTo(center.x, center.y - outerRadius);
        for (var i = 0; i < spikes; i++) {
            x = center.x + Math.cos(rot) * outerRadius;
            y = center.y + Math.sin(rot) * outerRadius;
            g.lineTo(x, y);
            rot += step;

            x = center.x + Math.cos(rot) * innerRadius;
            y = center.y + Math.sin(rot) * innerRadius;
            g.lineTo(x, y);
            rot += step;
        }
        g.lineTo(center.x, center.y - outerRadius);
        g.closePath();
        g.fillPath();
        if (lineColor != null) g.strokePath();
    };
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: SimpleStar
};

const game = new Phaser.Game(config);
