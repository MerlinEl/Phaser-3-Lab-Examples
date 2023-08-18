class Star3D extends Phaser.Scene {
    
    constructor () {super(); }
    preload () {
        this.load.script('Matrix2D', 'https://raw.githubusercontent.com/MerlinEl/Phaser-3-Lab-Examples/main/scripts/geometry/Matrix2D.js');
    }
    create() {
        var g = this.add.graphics({x: 800/2, y: 600/2});
        this.drawGradientStar(g, new Point2D(),  5, 100, 50, 0xFFFF00, 0xFF0000);
    }

    drawGradientStar (g, center, spikes, outerRadius, innerRadius, inner_color, outer_color) {
        var a = (Math.PI / 2) * 3;
        var x = center.x;
        var y = center.y;
        var step = Math.PI / spikes;
        var triangles = [];
        for (var i = 0; i < spikes; i++) {
            
            var p2 = new Point2D(
                center.x + Math.cos(a) * outerRadius,
                center.y + Math.sin(a) * outerRadius
            )
            a += step;

            var p3 = new Point2D(
                center.x + Math.cos(a) * innerRadius,
                center.y + Math.sin(a) * innerRadius
            )
            a += step;

            triangles.push(new Triangle2D(center, p2, p3))
        }
        // draw triangles pairs
        triangles.forEach((t, i) => {
            if (i < spikes) {
                var p1 = t.p1;
                var p2 = t.p2;
                var p3 = t.p3;
                var p4 = triangles[i + 1] ? triangles[i + 1].p2 : triangles[0].p2;
                g.fillGradientStyle(inner_color, outer_color, outer_color, inner_color, 1);
                g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                g.fillGradientStyle(outer_color, inner_color, inner_color, inner_color, 1);
                g.fillTriangle(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);
            }
        });
    };
    update () {}
}

const config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: Star3D
};

const game = new Phaser.Game(config);
