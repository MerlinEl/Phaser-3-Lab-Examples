// ******************************* //
//#region Point2D
// ******************************* //
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
//#endregion

// ******************************* //
//#region Triangle2D
// ******************************* //
class Triangle2D {
    /** @type {Point2D} */
    p1;
    p2;
    p3;
    constructor(p1, p2, p3) {
        this.p1 = p1 || new Point2D();
        this.p2 = p2 || new Point2D();
        this.p3 = p3 || new Point2D();
    }
    toString() {
        return "Triangle2D(\n\tp1:" + this.p1 + ",\n\tp2:" + this.p2 + ",\n\tp3:" + this.p3 + ")";
    }
}
//#endregion

// ******************************* //
//#region Trapezoid2D
// ******************************* //
class Trapezoid2D {
    /** @type {Point2D} */
    p1;
    p2;
    p3;
    p4;
    constructor(p1, p2, p3) {
        this.p1 = p1 || new Point2D();
        this.p2 = p2 || new Point2D();
        this.p3 = p3 || new Point2D();
        this.p4 = p4 || new Point2D();
    }
    toString() {
        return "Triangle2D(\n\tp1:" + this.p1 + ",\n\tp2:" + this.p2 + ",\n\tp3:" + this.p3 + ",\n\tp4:" + this.p4 + ")";
    }
}
//#endregion
