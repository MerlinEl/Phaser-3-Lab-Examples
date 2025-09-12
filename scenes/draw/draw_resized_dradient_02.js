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
var scene_size;
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
class Size2D {
    constructor(w, h) {
        this.width = this.w = w;
        this.height = this.h = h;
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
    get bottom() {
        return this.y + this.height;
    }
    get min() {
        return new Point2D(this.x, this.y);
    }
}
function create() {
    var scene = this;
    scene_size = new Size2D(scene.renderer.projectionWidth, scene.renderer.projectionHeight);
    // create temp graphics for visualization
    temp_gra = scene.add.graphics().lineStyle(5, 0xffffff, 1.0);
    drawGrid(temp_gra, scene_size.w, scene_size.h, 20, true, scene);
    // g.defaultFillAlpha = 0.3;
    // g.defaultFillColor = 0xFFFFFF;
    // g.fillRect(0, 0, 32, 20);
    scene_center = new Point2D(scene_size.w / 2, scene_size.h / 2);
    // 1. Create a Sprite Image with rotated gradient
    const colors = ["#ff0000", "#00ff00", "#0000ff"];
    const positions = [0, 0.5, 1];
    // 2.Create white texture for drawing with HTML5 API
    var image = createAddCanvasTexture(scene, "sprite_01", 400, 300, 300, 200);
    // 3. Draw linear gradient with random angle
    drawLinearGradient(image, 300, 200, colors, positions, Phaser.Math.Between(0, 360));
    //drawRectangleCntred(scene, new Size2D(image.width, image.height));
    // 4. mask image with rounded rectangle
    const corners = { tl: 20, tr: 20, bl: 20, br: 20 };
    var shape = maskImageGradient(image, corners);
    // 5. Add mouse events to test methods
    // move mask by mouse move
    var enable_dragg_mask = false;
    scene.input.on("pointermove", function (pointer) {
        if (enable_dragg_mask) {
            shape.x = pointer.x;
            shape.y = pointer.y;
        }
    });
    // add mouse click event to change sprite size and redraw gradient
    scene.input.on("pointerdown", function (pointer) {
        // Set random each time user click
        var w = Phaser.Math.Between(100, 600);
        var h = Phaser.Math.Between(100, 600);
        var a = Phaser.Math.Between(0, 360);
        drawLinearGradient(image, w, h, colors, positions, a);
        //drawRectangle(image, w, h);
        // center image to scene
        //image.setPosition(scene_center.x, scene_center.y);
        updateImageMask(image, w, h, corners);
        // debug will draw rectangle to check new image size
        drawRectangleCntred(scene, new Size2D(image.width, image.height));
        //enable_dragg_mask = true;
    });
    scene.input.on("pointerup", function (pointer) {
        if (enable_dragg_mask) {
            enable_dragg_mask = false;
        }
    });
}
// Draw simple white rectangle on HTML5 Texture displayed in Phaser 3
function drawRectangle(image, w, h) {
    console.log("Image Size Before w:", image.width, "h:", image.height);
    console.log("Texture Size Before w:", image.texture.width, "h:", image.texture.height);
    console.log("Set Size w:", w, "h:", h);

    image.setSize(w, h);
    image.setDisplaySize(w, h);

    var texture = image.texture; // CanvasTexture
    var ctx = texture.getContext("2d", { willReadFrequently: true }); //CanvasRenderingContext2D
    ctx.canvas.width = w;
    ctx.canvas.height = h;

    // Clear texture before drawing
    ctx.clearRect(0, 0, w, h);
    texture.clear();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    texture.refresh();

    console.log("Image Size After w:", image.width, "h:", image.height);
    console.log("Texture Size After w:", image.texture.width, "h:", image.texture.height);
}
/**
 * Create white texture for drawing with HTML5 API and add it as Image to the scene.
 * returns new Image
 */
function createAddCanvasTexture(scene, name, x, y, w, h) {
    // 1. Vytvoření standardního HTML canvas elementu.
    const tempCanvas = document.createElement("canvas");
    // 2. Nastavení velikosti canvas elementu
    tempCanvas.width = w;
    tempCanvas.height = h;
    // 3. Vytvoření Phaser Textury z našeho dočasného canvasu.
    const textureKey = "gradientTexture_" + name + "_" + new Date().getTime();
    // 4. Fill white rectangle
    const ctx = tempCanvas.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, h);

    scene.textures.addCanvas(textureKey, tempCanvas);
    // 7. Vytvoření a umístění objektu Image, který zobrazí texturu.
    return scene.add.image(x, y, textureKey);
}
function drawLinearGradient(image, w, h, colors, positions, gradientAngle) {
    // Validate input parameters
    if (!colors || !positions || colors.length !== positions.length || colors.length === 0) {
        console.error("Colors and positions arrays must be of the same length");
        return;
    }
    // If nothing changes return
    if (image.gradientAngle == gradientAngle && image.width == w && image.height == h) return;
    image.gradientAngle = gradientAngle;

    // Redraw sprite gradient
    var texture = image.texture; // CanvasTexture
    var p1 = new Point2D();
    var p2 = new Point2D(w, 0); // Initial horizontal gradient
    var pos = new Point2D();
    const center = new Point2D(w / 2, h / 2);
    const radAngle = degToRad(gradientAngle);
    var ctx = image.texture.getContext("2d", { willReadFrequently: true }); //CanvasRenderingContext2D

    // Is the size was changed then update image size
    if (image.width != w || image.height != h) {
        image.setSize(w, h);
        image.setDisplaySize(w, h);
        // texture.width = w;
        // texture.height = h;
        ctx.canvas.width = w;
        ctx.canvas.height = h;
    }

    // Clear texture before drawing
    texture.clear();
    // Important: Save the context state!
    ctx.save();

    // If gradient is rotated
    if (gradientAngle != 0) {
        // Rotate the canvas *around its center*
        ctx.translate(center.x, center.y);
        ctx.rotate(radAngle);
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

    //Calculate gradient
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    for (let i = 0; i < colors.length; i++) {
        var clr = Phaser.Display.Color.HexStringToColor(colors[i]).rgba;
        gradient.addColorStop(positions[i], clr);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(pos.x, pos.y, w, h);

    texture.refresh();

    // Restore the context state! Crucial!
    ctx.restore();
}
function maskImageGradient(image, corners) {
    var x = 0;
    var y = 0;
    var w = image.width;
    var h = image.height;
    var scene = image.scene;

    // 1. Create Graphics Object for the Mask (do NOT add to scene )
    var g = scene.make.graphics({ add: false });

    // 2. Apply Transformation (before drawing!)
    var offset = new Point2D(w * image.originX, h * image.originY);
    g.translateCanvas(-offset.x, -offset.y);
    g.setPosition(image.x, image.y);

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
//    g.setName("maskGraphics");
function updateImageMask(image, w, h, corners) {
    maskImageGradient(image, corners);
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

function createRectSizeComponents(scene) {
    scene.rectSizeGraphics = scene.add.graphics().lineStyle(5, 0x00ff00, 1.0);
    scene.rectSizeWidthText = scene.add
        .text(10, 10, `Width: 0`, {
            fontSize: "12px",
            color: "#ffffff",
        })
        .setOrigin(0, 0);
    scene.rectSizeHeightText = scene.add
        .text(10, 20, `Height: 0`, {
            fontSize: "12px",
            color: "#ffffff",
        })
        .setOrigin(0, 0);
}

/**
 * Draws a centered rectangle on a Graphics object and displays its width and height.
 *
 * @param {Phaser.GameObjects.Graphics} graphics - The Graphics object to draw on.
 * @param {object} sceneSize - An object with 'w' (width) and 'h' (height) properties representing the scene size.
 * @param {object} rectangleSize - An object with 'w' (width) and 'h' (height) properties representing the rectangle size.
 * @param {Phaser.Scene} scene - The Phaser scene to which the text objects will be added.
 */
function drawRectangleCntred(scene, rectangleSize) {
    if (!scene.rectSizeGraphics) createRectSizeComponents(scene);

    const sceneSize = new Size2D(scene.renderer.projectionWidth, scene.renderer.projectionHeight);
    const centerX = (sceneSize.w - rectangleSize.w) / 2;
    const centerY = (sceneSize.h - rectangleSize.h) / 2;
    const rect = new Rectangle2D(centerX, centerY, rectangleSize.w, rectangleSize.h);

    const graphics = scene.rectSizeGraphics;
    graphics.clear();
    graphics.lineStyle(2, 0x00ff00, 1);
    graphics.strokeRectShape(rect);

    // Text objects
    scene.rectSizeWidthText.setText(`Width: ${rect.width}`);
    scene.rectSizeWidthText.setPosition(rect.x, rect.y - 15);
    scene.rectSizeHeightText.setText(`Height: ${rect.height}`);
    scene.rectSizeHeightText.setPosition(rect.x, rect.bottom + 2);
}

/**
 * Draws a grid on a Phaser Graphics object.
 *
 * @param {Phaser.GameObjects.Graphics} graphics - The Graphics object to draw on.
 * @param {number} width - The width of the grid.
 * @param {number} height - The height of the grid.
 * @param {number} cellSize - The size of each cell in the grid.
 * @param {boolean} [showText=false] - Whether to show text labels for the axes.
 * @param {Phaser.Scene} [scene] - The scene to add text to.
 */
function drawGrid(graphics, width, height, cellSize, showText = false, scene = null) {
    graphics.lineStyle(1, 0x999999, 0.5); // Grid line style

    // Draw vertical lines
    for (let x = 0; x <= width; x += cellSize) {
        graphics.moveTo(x, 0);
        graphics.lineTo(x, height);
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += cellSize) {
        graphics.moveTo(0, y);
        graphics.lineTo(width, y);
    }

    graphics.strokePath();

    if (showText && scene) {
        // Add text labels for x axis
        for (let x = 0; x <= width; x += cellSize) {
            const text = scene.add.text(x + 2, 2, String(x), {
                fontSize: "8px",
                color: "#ffffff",
            });
            text.setOrigin(0, 0);
        }

        // Add text labels for y axis
        for (let y = 0; y <= height; y += cellSize) {
            const text = scene.add.text(2, y + 2, String(y), {
                fontSize: "8px",
                color: "#ffffff",
            });
            text.setOrigin(0, 0);
        }
    }
}
function update() {}
