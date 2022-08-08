var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var bounds;
var graphics;
var pathCircle;
var pathNgon;
var pathRect;

function create() {

    bounds = new Phaser.Geom.Rectangle();
    graphics = this.add.graphics();

    // Circle
    pathCircle = createCircle(500, 320 - 200 / 2, 200);

    // RECT [x, y, width, height]
    pathRect = createRectangle(50, 50, 100, 200);

    // NGON [x, y, width, height, points count]
    pathNgon = createNgon(300, 100, 220, 5)

    // Cubic Bezier
    var startPoint = new Phaser.Math.Vector2(0, 320);
    var controlPoint1 = new Phaser.Math.Vector2(100, 100);
    var controlPoint2 = new Phaser.Math.Vector2(200, 100);
    var endPoint = new Phaser.Math.Vector2(300, 320);
    var curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);
    var r = this.add.curve(200, 320, curve, 0x00aa00);
    r.setStrokeStyle(4, 0xff0000);
}

function update() {

    graphics.clear();

    // Draw CIRCLE
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillPoints(pathCircle.getPoints());
    graphics.lineStyle(2, 0x00ff00, 2);
    pathCircle.draw(graphics);

    // Draw RECTANGLE
    graphics.lineStyle(2, 0x00ff00, 2);
    pathRect.draw(graphics);

    // Draw NGON
    graphics.fillStyle(0x0000ff, 1);
    graphics.fillPoints(pathNgon.getPoints());
    graphics.lineStyle(10, 0x00ff00, 1);
    graphics.strokePoints(pathNgon.getPoints(), true);
    //pathNgon.draw(graphics);
}


function createRectangle(x, y, w, h) {

    var path = new Phaser.Curves.Path(x, y);
    path.lineTo(x + w, y);
    path.lineTo(x + w, y + h);
    path.lineTo(x, y + h);
    path.lineTo(x, y);
    return path;
}

function createNgon(x, y, w, pointsCount) {
    // Get the middle of the rectangle
    var center_x = w / 2;
    var center_y = w / 2;
    var r = w / 2;

    var stepAngle = 360 / pointsCount;
    var stepRad = stepAngle * Math.PI / 180;
    var angleRadOffset = getOffsetAngle(pointsCount) * Math.PI / 180;
    var lastPoint = getPointOnCircle(pointsCount - 1);
    var path = new Phaser.Curves.Path(lastPoint.x, lastPoint.y);
    for (var i = 0; i < pointsCount; i++) {
        var nextPoint = getPointOnCircle(i);
        path.lineTo(nextPoint.x, nextPoint.y);
    }
    function getPointOnCircle(step) {
        return new Phaser.Geom.Point(
            x + center_x + r * Math.cos(step * stepRad + angleRadOffset),
            y + center_x + r * Math.sin(step * stepRad + angleRadOffset)
        )
    }
    var firstPoint = getPointOnCircle(0); // fix gap in outline
    path.lineTo(firstPoint.x, firstPoint.y);
    return path;
}

function getOffsetAngle(pointsCount) {
    // is even
    if (pointsCount % 2 == 0) return 0;
    var angle = 0;
    switch (pointsCount) {

        case 3: angle = -90; break;
        case 5: angle = -90; break;
        case 7: angle = -89; break;
        case 9: angle = -90; break;
        case 11: angle = -86; break;
    }
    return angle;
}

function createCircle(x, y, w) {
    // Get the middle of the rectangle
    var center_x = w / 2;
    var center_y = w / 2;
    var r = w / 2;
    var pointsCount = 44;
    var stepAngle = 360 / pointsCount;
    var stepRad = stepAngle * Math.PI / 180;
    var lastPoint = getPointOnCircle(pointsCount - 1);
    var path = new Phaser.Curves.Path(lastPoint.x, lastPoint.y);
    for (var i = 0; i < pointsCount; i++) {
        var nextPoint = getPointOnCircle(i);
        path.lineTo(nextPoint.x, nextPoint.y);
    }
    function getPointOnCircle(step) {
        return new Phaser.Geom.Point(
            x + center_x + r * Math.cos(step * stepRad),
            y + center_x + r * Math.sin(step * stepRad)
        )
    }
    return path;
}