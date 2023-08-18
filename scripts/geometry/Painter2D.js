/**
 *The Painter2D class
 * @author MerlinEl + Great Help From Internet 2023
 */
// *************************************************************** //
var Painter2D = {};
// *************************************************************** //
Painter2D.drawStarDonut = function (g, center, out_r1, in_r1, out_r2, in_r2, inner_color, outer_color, spikes) {
    console.log("drawStarDonut >\n\tout_r1:", out_r1, "\n\tin_r1:", in_r1, "\n\tout_r2:", out_r2, "\n\tin_r2:", in_r2, "center:", center);
    var a = (Math.PI / 2) * 3; // - Orien.degToRad(angle_offset);
    var step = Math.PI / spikes;
    var trapezoids = [];
    for (var i = 0; i < spikes; i++) {
        var p1 = new Point2D(center.x + Math.cos(a) * out_r1, center.y + Math.sin(a) * out_r1);
        var p2 = new Point2D(center.x + Math.cos(a) * out_r2, center.y + Math.sin(a) * out_r2);
        a += step;
        var p3 = new Point2D(center.x + Math.cos(a) * in_r2, center.y + Math.sin(a) * in_r2);
        var p4 = new Point2D(center.x + Math.cos(a) * in_r1, center.y + Math.sin(a) * in_r1);
        a += step;
        trapezoids.push(new Trapezoid2D(p1, p2, p3, p4));
    }
    // draw triangles pairs
    trapezoids.forEach((t, i) => {
        if (i < spikes) {
            var p1 = t.p1; // out_r1
            var p2 = t.p2; // out_r2
            var p3 = t.p3; // in_r2
            var p4 = t.p4; // in_r1
            g.fillGradientStyle(inner_color, outer_color, outer_color, inner_color, 1);
            g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            g.fillGradientStyle(outer_color, inner_color, inner_color, outer_color, 1);
            g.fillTriangle(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);

            p1 = p4;
            p2 = p3;
            p3 = trapezoids[i + 1] ? trapezoids[i + 1].p2 : trapezoids[0].p2;
            p4 = trapezoids[i + 1] ? trapezoids[i + 1].p1 : trapezoids[0].p1;
            g.fillGradientStyle(inner_color, outer_color, outer_color, inner_color, 1);
            g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            g.fillGradientStyle(outer_color, inner_color, inner_color, outer_color, 1);
            g.fillTriangle(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);

            /*g.lineStyle(2, 0x0000ff, 1.0);
            g.strokeCircle(p1.x, p1.y, 5);
            g.lineStyle(2, 0x00ff00, 1.0);
            g.strokeCircle(p2.x, p2.y, 5);
            g.lineStyle(2, 0x00ffff, 1.0);
            g.strokeCircle(p3.x, p3.y, 5);
            g.lineStyle(2, 0xff0000, 1.0);
            g.strokeCircle(p4.x, p4.y, 5);*/
        }
    });
};

Painter2D.drawGradientStar = function (g, center, outerRadius, innerRadius, inner_color, outer_color, spikes) {
    console.log("drawGradientStar >\n\tout_r1:", outerRadius, "\n\tin_r1:", innerRadius, "center:", center);
    var a = (Math.PI / 2) * 3; // start angle
    var step = Math.PI / spikes; // step angle
    var triangles = [];
    for (var i = 0; i < spikes; i++) {
        var p2 = new Point2D(center.x + Math.cos(a) * outerRadius, center.y + Math.sin(a) * outerRadius);
        a += step;
        var p3 = new Point2D(center.x + Math.cos(a) * innerRadius, center.y + Math.sin(a) * innerRadius);
        a += step;
        triangles.push(new Triangle2D(new Point2D(center.x, center.y), p2, p3));
    }
    // draw triangles pairs
    triangles.forEach((t, i) => {
        if (i < spikes) {
            var p1 = t.p1; // center point
            var p2 = t.p2; // outerRadius point
            var p3 = t.p3; // innerRadius point
            // next triangle(or first triangle) outerRadius point
            var p4 = triangles[i + 1] ? triangles[i + 1].p2 : triangles[0].p2;
            g.fillGradientStyle(inner_color, outer_color, outer_color, null, 1);
            g.fillTriangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y); // clockwise
            g.fillGradientStyle(outer_color, outer_color, inner_color, null, 1);
            g.fillTriangle(p3.x, p3.y, p4.x, p4.y, p1.x, p1.y);

            /*g.lineStyle(2, 0x0000ff, 1.0);
            g.strokeCircle(p2.x, p2.y, 2);
            g.lineStyle(2, 0xff0000, 1.0);
            g.strokeCircle(p3.x, p3.y, 2);*/
        }
    });
};

Painter2D.drawStarRadialGradient = function (g, outerRadius, innerRadius, colors, positions, points_count) {
    if (colors.length != positions.length || colors.length < 2) return;
    var center = new Point2D();
    colors = colors.reverse();
    // first > draw first layer
    var out_r1 = outerRadius * positions[1];
    var in_r1 = innerRadius * positions[1];
    Painter2D.drawGradientStar(g, center, out_r1, in_r1, colors[0], colors[1], points_count);
    if (colors.length < 3) return; // if there is more than two colors
    // next > draw outer circle from trapezoids
    for (var i = 2; i < positions.length; i++) {
        var out_r2 = outerRadius * positions[i];
        var in_r2 = innerRadius * positions[i];
        var inner_color = colors[i - 1]; //0xff0000; //
        var outer_color = colors[i]; //0x0000ff; //
        Painter2D.drawStarDonut(g, center, out_r1, in_r1, out_r2, in_r2, inner_color, outer_color, points_count);
        out_r1 = out_r2; // shift end radius
        in_r1 = in_r2; // shift start radius
    }
};
