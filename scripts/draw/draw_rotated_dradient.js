//https://phaser.io/phaser3/devlog/128
//https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#2d2d2d",
    parent: "phaser-example",
    scene: {
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);
const degToRad = (deg) => (deg * Math.PI) / 180;
class Point2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point2D(this.x, this.y);
    }
}
class Rectangle2D {
    constructor(x = 0, y = 0, w = 100, h = 100) {
        this.x = x;
        this.y = y;
        this.width = this.w = w;
        this.height = this.h = h;
    }
    clone() {
        return new Rectangle2D(this.x, this.y, this.w, this.h);
    }
    get right() {
        return this.x + this.w;
    }
    get min() {
        return new Point2D(this.x, this.y);
    }
}
function create() {
    // 1. Create a Sprite with rotated gradient
    createRotatedGradient(this, 200, 200, 200, 100, 45);
}

function createRotatedGradient(scene, x, y, width, height, gradientAngle) {
    // 2. Vytvoření dočasného, standardního HTML canvas elementu.
    const tempCanvas = document.createElement("canvas");
    // 3. Nastavení velikosti canvas elementu
    tempCanvas.width = width;
    tempCanvas.height = height;
    // 4. Vytvoření proměnných pro přhlednější použití
    var w = width;
    var h = height;
    var p1 = new Point2D();
    var p2 = new Point2D(w, 0);
    var pos = new Point2D();
    const center = new Point2D(w / 2, h / 2);
    const textureKey = "gradientTexture_" + new Date().getTime();
    const radAngle = degToRad(gradientAngle);
    const ctx = tempCanvas.getContext("2d");

    // 5. Nakreslení orotovaného gradientu na dočasný canvas.
    if (gradientAngle != 0) {
        // Vycentrování canvas
        ctx.translate(center.x, center.y);
        // Otočení canvas
        ctx.rotate(radAngle);
        // Vrácení pozice canvas zpět
        ctx.translate(-center.x, -center.y);

        // Get maximum bounds of a rotated rectangle
        var bb = new Rectangle2D(0, 0, w, h);
        var rotatedBB = getRotatedRectangleBounds(bb, center, gradientAngle);
        // Nastavení počáteční pozice vykreslování grarientu
        pos.x = (w - rotatedBB.w) / 2;
        pos.y = (h - rotatedBB.h) / 2;
        // Nastavení velikosti gradientu tak, aby pokryl plochu otočeného obdéníku
        w = rotatedBB.w;
        h = rotatedBB.h;
        // Nastavení bodů pro počátek a konec gradientu
        p1 = rotatedBB.min;
        p2 = new Point2D(rotatedBB.right, rotatedBB.y);
    }

    console.log("p1:", p1, "p2:", p2, "pos:", pos);

    // Vytvoření lineárního gradientu z bodu p1 do bodu p2
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.5, "#00ff00");
    gradient.addColorStop(1, "#0000ff");

    ctx.fillStyle = gradient;
    ctx.fillRect(pos.x, pos.y, w, h);

    ctx.restore();

    // 6. Vytvoření Phaser Textury z našeho dočasného canvasu.
    scene.textures.addCanvas(textureKey, tempCanvas);

    // 7. Vytvoření a umístění objektu Image, který zobrazí texturu.
    return scene.add.image(x, y, textureKey);
}

/**
 * Rotate bounds around point.
 * @param {Rectangle2D} rect unrotated rectangle
 * @param {Number} pivot rotation point
 * @param {Number} angle in degrees
 * @returns Rotated resized bounding box
 */
function getRotatedRectangleBounds(rect, pivot, angle) {
    // Když je rotace větší než 360 stupňů nebo v záporných hodnotách
    const normalizedAngle = ((angle % 360) + 360) % 360;
    if (normalizedAngle == 0) {
        return rect;
    } else {
        // Vytvoř 4 vertexy z rohů obdélníku, který nemá rotaci
        var vertices = [new Point2D(rect.x, rect.y), new Point2D(rect.width, rect.y), new Point2D(rect.width, rect.height), new Point2D(rect.x, rect.height)];
        // Orotuj vertexy kolem pivotu
        var points = rotateVertices(angle, vertices, pivot);
        // Vypočítej velikost orotovaného obdélníku
        var min = points[0].clone();
        var max = points[0].clone();
        points.forEach((p) => {
            // get min
            if (p.x < min.x) min.x = p.x;
            if (p.y < min.y) min.y = p.y;
            // get max
            if (p.x > max.x) max.x = p.x;
            if (p.y > max.y) max.y = p.y;
        });
        return new Rectangle2D(min.x, min.y, max.x - min.x, max.y - min.y);
    }
}
/**
 * Rotate Vertices around Point.
 * @param {Number} angle - The total angle of rotation for the object
 * @param {Point2D[]} vertices - Array of vertices to rotate
 * @param {Point2D} pivot - The point of rotation
 * @returns Array of rotated vertices
 */
function rotateVertices(angle, vertices, pivot) {
    // Get rotated points position (rotating vector)
    var rotatedVertices = [];
    vertices.forEach((p) => {
        var new_p = rotatePointAround(p, pivot, angle);
        rotatedVertices.push(new_p);
    });
    return rotatedVertices;
}
/**
 * Rotate point around pivot
 * @author Gemini 2025
 */
function rotatePointAround(point, pivot, angle) {
    var a = degToRad(angle);
    var s = Math.sin(a);
    var c = Math.cos(a);

    // Přesuneme vrchol do souřadnicového systému
    point.x -= pivot.x;
    point.y -= pivot.y;

    // Aplikujeme rotaci
    var new_x = point.x * c - point.y * s;
    var new_y = point.x * s + point.y * c;

    // Vrátíme vrchol zpět a vrátíme nově rotovaný bod
    point.x = new_x + pivot.x;
    point.y = new_y + pivot.y;

    return point;
}
function update() {}
