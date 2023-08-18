class Point2D {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    toString() {
        return "Point2D( x:" + this.x + ", y:" + this.y + ")";
    }
}

class Triangle2D {
    /** @type {Point2D} */
    p1; p2; p3;
    constructor(p1, p2, p3) {
        this.p1 = p1 || new Point2D();
        this.p2 = p2 || new Point2D();
        this.p3 = p3 || new Point2D();
    }
    toString() {
        return "Triangle2D(\n\tp1:" + this.p1 + ",\n\tp2:" + this.p2 + ",\n\tp3:" + this.p3 + ")";
    }
}

class GradientStar extends Phaser.Scene {
    
    constructor () {super(); }
    preload () {}
    create() {
        var g = this.add.graphics({x: 800/2, y: 600/2});
        this.drawGradientStar(g, new Point2D(),  5, 100, 50, 0xFFFF00, 0xFF0000);
    }

    drawGradientStar (g, center, spikes, outerRadius, innerRadius, inner_color, outer_color) {
        var a = (Math.PI / 2) * 3;
        var x = center.x;
        var y = center.y;
        var step = Math.PI / spikes;
        //var points = [new Point2D(center.x, center.y - outerRadius)];

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
        //g.lineTo(center.x, center.y - outerRadius);
        // draw triangles from points
        triangles.forEach((t, i) => {
            if (i < spikes) {
                var p1 = t.p1;
                var p2 = t.p2;
                var p3 = t.p3;
                g.fillGradientStyle(inner_color, outer_color, outer_color, inner_color, 1);
                g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
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
    scene: GradientStar
};

const game = new Phaser.Game(config);
