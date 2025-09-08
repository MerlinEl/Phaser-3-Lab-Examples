//https://phaser.io/phaser3/devlog/128
//https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Graphics.html
var config = {
    type: Phaser.AUTO, //type: Phaser.WEBGL,
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
var temp_gra;
var scene_center;
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
    // create temp graphics for visualization
    temp_gra = this.add.graphics().lineStyle(5, 0xffffff, 1.0);
    // g.defaultFillAlpha = 0.3;
    // g.defaultFillColor = 0xFFFFFF;
    // g.fillRect(0, 0, 32, 20);
    scene_center = new Point2D(this.renderer.projectionWidth / 2, this.renderer.projectionHeight / 2);
    // 1. Create a Sprite Image with rotated gradient
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const positions = [0, 0.5, 1];
    var image = createRotatedGradient(this, 400, 300, 300, 200, colors, positions, 45);
    // 2. mask image with rounded rectangle
    const corners = { tl: 20, tr: 20, bl: 20, br: 20 };
    var shape = maskImageGradient(image, 0, corners);
    // move mask by mouse move
    var enable_dragg_mask = false;
    this.input.on("pointermove", function (pointer) {
        if (enable_dragg_mask) {
            shape.x = pointer.x;
            shape.y = pointer.y;
        }
    });
    // add mouse click event to change sprite size and redraw gradient
    this.input.on("pointerdown", function (pointer) {
        //setImageSize(image, Phaser.Math.Between(100, 600), Phaser.Math.Between(100, 600), corners);
        setGradientAngle(image, colors, positions, Phaser.Math.Between(0, 360));
        // drawImageRect(image);
        //enable_dragg_mask = true;
    });
    this.input.on("pointerup", function (pointer) {
        if (enable_dragg_mask) {
            enable_dragg_mask = false;
        }
    });
}

function maskImageGradient(image, angle, corners) {
    var x = 0;
    var y = 0;
    var w = image.width;
    var h = image.height;
    var scene = image.scene;

    // 1. Create Graphics Object for the Mask (do NOT add to scene yet)
    var g = scene.make.graphics({ add: false });

    // 2. Apply Transformation (before drawing!)
    var offset = new Point2D(w * image.originX, h * image.originY);
    g.translateCanvas(-offset.x, -offset.y);
    g.setPosition(image.x, image.y);
    g.angle = angle;

    // 3. Define the Shape of the Mask (Rounded Rectangle)
    g.fillStyle(0xffffff, 1);
    g.beginPath();
    g.moveTo(x + corners.tl, y);
    g.lineTo(x + w - corners.tr, y);
    if (corners.tr != 0) {
        g.arc(x + w - corners.tr, y + corners.tr, corners.tr, degToRad(270), degToRad(360));
    }
    g.lineTo(x + w, y + h - corners.br);
    if (corners.br != 0) {
        g.arc(x + w - corners.br, y + h - corners.br, corners.br, degToRad(0), degToRad(90));
    }
    g.lineTo(x + corners.bl, y + h);
    if (corners.bl != 0) {
        g.arc(x + corners.bl, y + h - corners.bl, corners.bl, degToRad(90), degToRad(180));
    }
    g.lineTo(x, y + corners.tl);
    if (corners.tl != 0) {
        g.arc(x + corners.tl, y + corners.tl, corners.tl, degToRad(180), degToRad(270));
    }
    g.closePath();
    g.fillPath();

    // 4. Create a Geometry Mask
    const mask = g.createGeometryMask();

    // 5. Apply the Mask to the Image
    image.setMask(mask);

    // 6. Set a Name
    g.setName("maskGraphics");
    return g;
}
function updateImageMask(image, w, h, corners) {
    maskImageGradient(image, image.rotation, corners);
}
function setGradientAngle(image, colors, positions, gradientAngle) {
    if (gradientAngle == 0) return;

    // Redraw sprite gradient
    var texture = image.texture; // CanvasTexture
    var w = texture.width;
    var h = texture.height;
    var p1 = new Point2D();
    var p2 = new Point2D(w, 0); // Initial horizontal gradient
    var pos = new Point2D();
    const center = new Point2D(w / 2, h / 2);
    const radAngle = degToRad(gradientAngle);
    var ctx = image.texture.getContext("2d", { willReadFrequently: true }); //CanvasRenderingContext2D

    // With this nothing changes visually
    ctx.clearRect(0, 0, w, h);
    // With this is cleared rotated rectangle
    texture.clear();

    // Important: Save the context state!
    ctx.save();
    // Rotate the canvas *around its center*
    ctx.translate(center.x, center.y);
    ctx.rotate(radAngle);
    ctx.translate(-center.x, -center.y);

    // Get maximum bounds of a rotated rectangle
    var bb = new Rectangle2D(0, 0, w, h);
    var rotatedBB = getRotatedRectangleBounds(bb, center, gradientAngle);
    w = rotatedBB.w;
    h = rotatedBB.h;
    pos.x = rotatedBB.x;
    pos.y = rotatedBB.y;

    //Calculate gradient
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    for (let i = 0; i < colors.length; i++) {
        var clr = Phaser.Display.Color.HexStringToColor(colors[i]).rgba; //IntegerToColor
        gradient.addColorStop(positions[i], clr);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(pos.x, pos.y, w, h);
    texture.refresh();

    // Restore the context state! Crucial!
    ctx.restore();
}
function setImageSize(image, w, h, corners) {
    console.log("setSpriteSize > image:", image, "w:", w, "h:", h);
    image.setSize(w, h);
    image.setDisplaySize(w, h);
    // center image to scene
    var scene = image.scene;
    image.setPosition(scene_center.x, scene_center.y);
    updateImageMask(image, w, h, corners);
}
function drawImageRect(image) {
    var rect = new Rectangle2D(image.x - image.width / 2, image.y - image.height / 2, image.width, image.height);
    temp_gra.clear();
    temp_gra.strokeRectShape(rect);
    // temp_gra.translateCanvas(center.x, center.y)
    // temp_gra.rotateCanvas(radAngle);
    // temp_gra.translateCanvas(-center.x, -center.y);
}
/**
 * Create Image with rotated gradient
 */
function createRotatedGradient(scene, x, y, width, height, colors, positions, gradientAngle) {
    if (!colors || !positions || colors.length !== positions.length || colors.length === 0) {
        console.error("Colors and positions arrays must be of the same length");
        return;
    }

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
    const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });

    // with this does not work - maybe later
    // const texture = scene.textures.createCanvas(textureKey, width, height);
    // const ctx = texture.getSourceImage().getContext('2d', { willReadFrequently: true });

    // Important: Save the context state!
    ctx.save(); // Add this to save the initial state

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
    for (let i = 0; i < colors.length; i++) {
        var clr = Phaser.Display.Color.HexStringToColor(colors[i]).rgba; //IntegerToColor
        gradient.addColorStop(positions[i], clr);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(pos.x, pos.y, w, h);

    ctx.restore();

    // 6. Vytvoření Phaser Textury z našeho dočasného canvasu.
    scene.textures.addCanvas(textureKey, tempCanvas);

    // 7. Vytvoření a umístění objektu Image, který zobrazí texturu.
    return scene.add.image(x, y, textureKey);
}

/**
 * Gets the axis-aligned bounding box (AABB) of a rotated rectangle.
 *
 * @param {Rectangle2D} rect - The original, unrotated rectangle.
 * @param {Point2D} pivot - The point to rotate around.
 * @param {number} angle - The angle of rotation in degrees.
 * @returns {Rectangle2D} A new Rectangle2D object representing the bounding box of the rotated rectangle.
 */
function getRotatedRectangleBounds(rect, pivot, angle) {
    // 1. Calculate the vertices of the unrotated rectangle
    const vertices = [
        new Point2D(rect.x, rect.y), // Top-left
        new Point2D(rect.x + rect.width, rect.y), // Top-right
        new Point2D(rect.x + rect.width, rect.y + rect.height), // Bottom-right
        new Point2D(rect.x, rect.y + rect.height), // Bottom-left
    ];

    // console.log("getRotatedRectangleBounds:", {
    //     rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    //     pivot: { x: pivot.x, y: pivot.y },
    //     angle: angle,
    //     vertices: vertices,
    // });

    // 2. Rotate each vertex around the pivot
    const rotatedVertices = vertices.map((vertex) => rotatePointAround(vertex, pivot, angle));

    // console.log("getRotatedRectangleBounds: rotatedVertices", rotatedVertices);

    // 3. Find the minimum and maximum x and y values of the rotated vertices
    let minX = rotatedVertices[0].x;
    let minY = rotatedVertices[0].y;
    let maxX = rotatedVertices[0].x;
    let maxY = rotatedVertices[0].y;

    rotatedVertices.forEach((vertex) => {
        // console.log("vertex:", vertex, minX, minY, maxX, maxY);
        minX = Math.min(minX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxX = Math.max(maxX, vertex.x);
        maxY = Math.max(maxY, vertex.y);
    });

    // console.log("getRotatedRectangleBounds: minX", minX, "minY", minY, "maxX", maxX, "maxY", maxY);

    // 4. Construct the bounding box from the min and max values
    const rotatedWidth = maxX - minX;
    const rotatedHeight = maxY - minY;

    // console.log("getRotatedRectangleBounds: rotatedWidth", rotatedWidth, "rotatedHeight", rotatedHeight);

    return new Rectangle2D(minX, minY, rotatedWidth, rotatedHeight);
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
 * Rotate a point around a pivot.
 *
 * @param {Point2D} point - The point to rotate.
 * @param {Point2D} pivot - The point to rotate around.
 * @param {number} angle - The angle of rotation in degrees.
 * @returns {Point2D} A new Point2D object representing the rotated point.
 */
function rotatePointAround(point, pivot, angle) {
    // Convert angle to radians
    const angleInRadians = degToRad(angle);
    const sine = Math.sin(angleInRadians);
    const cosine = Math.cos(angleInRadians);

    // Translate point to origin (pivot becomes the new origin)
    const translatedX = point.x - pivot.x;
    const translatedY = point.y - pivot.y;

    // Perform rotation
    const newX = translatedX * cosine - translatedY * sine;
    const newY = translatedX * sine + translatedY * cosine;

    // Translate back to original position
    const rotatedX = newX + pivot.x;
    const rotatedY = newY + pivot.y;

    // console.log("rotatePointAround:", {
    //     point: { x: point.x, y: point.y },
    //     pivot: { x: pivot.x, y: pivot.y },
    //     angle: angle,
    //     angleInRadians: angleInRadians,
    //     sine: sine,
    //     cosine: cosine,
    //     translatedX: translatedX,
    //     translatedY: translatedY,
    //     newX: newX,
    //     newY: newY,
    //     rotatedX: rotatedX,
    //     rotatedY: rotatedY,
    // });

    return new Point2D(rotatedX, rotatedY);
}
function update() {}

/*
const texture = this.textures.addDynamicTexture('maskedPic', 368, 290);
console.log("texture:", texture)
const pic = this.make.image({ key: 'pic', origin: { x: 0, y: 0 }, add: true });
const maskImage = this.make.image({ key: 'mask', origin: { x: 0, y: 0 }, add: false });
pic.enableFilters().filters.external.addMask(maskImage);
texture.draw(pic).render();
this.add.sprite(560, 300, 'maskedPic');
*/
