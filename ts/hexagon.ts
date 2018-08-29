import {
  HexagonOrientation,
  Point,
  HexParams
} from './hexagon.model';

export class Hexagon {
  /**
   * A Hexagon is a 6 sided polygon, our hexes don't have to be symmetrical, i.e. ratio of width to height could be 4 to 3
   * @constructor
   * @param id {string}
   * @param x {number}
   * @param y {number}
   */
  constructor(
    public id: string,
    public x: number,
    public y: number,
    public hexParams: HexParams,
    drawStats: boolean = false
  ) {
    this.points = [];//Polygon Base

    //TODO find common code and extract it here
    if (this.hexParams.orientation == HexagonOrientation.normal) {
      this.initNormalOrientation();
    }
    else {
      this.initRotatedOrientation();
    }

    this.topLeftPoint = new Point(this.x, this.y);
    this.bottomRightPoint = new Point(this.x + hexParams.width, this.y + hexParams.height);
    this.midPoint = new Point(this.x + (hexParams.width / 2), this.y + (hexParams.height / 2));
    this.p1 = new Point(this.x + this.x1, this.y + this.y1);
    this.selected = false;
  }

  public points: Point[];
  public y1: number;
  public x1: number;
  public topLeftPoint: Point;
  public bottomRightPoint: Point;
  public midPoint: Point;
  public p1: Point;
  public selected: boolean;
  public PathCoOrdY: number;
  public PathCoOrdX: number;

  /**
  * Returns absolute distance in pixels from the mid point of this hex to the given point
  * Provided by: Ian (Disqus user: boingy)
  * @param {Point} p the test point
  * @return {number} the distance in pixels
  */
  public distanceFromMidPoint(point: Point) {
    // Pythagoras' Theorem: Square of hypotenuse = sum of squares of other two sides
    var deltaX = this.midPoint.x - point.x;
    var deltaY = this.midPoint.y - point.y;

    // squaring so don't need to worry about square-rooting a negative number 
    return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
  };

  /**
   * draws this Hexagon to the canvas
   * @param context {CanvasRenderingContext2D}
   * @param drawStats {boolean}
   */
  public draw(context: CanvasRenderingContext2D): void {
    context.strokeStyle = this.selected ? "black" : "grey";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(point => context.lineTo(point.x, point.y))
    // for (let i = 1; i < this.points.length; i++) {
    //   let p = this.points[i];
    //   context.lineTo(p.x, p.y);
    // }
    context.closePath();
    context.stroke();

    if (this.id) {
      //draw text for debugging
      if (this.hexParams.styles) {
        this.setCanvasStyles(context);
      }
      //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
      context.fillText(this.id, this.midPoint.x, this.midPoint.y);
    }

    if (this.PathCoOrdX !== null
      && this.PathCoOrdY !== null
      && typeof (this.PathCoOrdX) != "undefined"
      && typeof (this.PathCoOrdY) != "undefined") {
      //draw co-ordinates for debugging
      this.setCanvasStyles(context);
      //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
      context.fillText("(" + this.PathCoOrdX + "," + this.PathCoOrdY + ")", this.midPoint.x, this.midPoint.y + 10);
    }

    if (this.hexParams.displayStats) {
      this.drawStats(context);
    }
  };
  /**
   * Returns true if the x,y coordinates are inside this hexagon
   * @param x {number}
   * @param y {number}
   * @return {boolean}
   */
  public isInBounds(x: number, y: number): boolean {
    return this.contains(new Point(x, y));
  }

  /**
   * Returns true if the point is inside this hexagon, it is a quick contains
   * @this {Hexagon}
   * @param {Point} p the test point
   * @return {boolean}
   */
  public isInHexBounds(p: Point): boolean {
    return this.topLeftPoint.x < p.x
      && this.topLeftPoint.y < p.y
      && p.x < this.bottomRightPoint.x
      && p.y < this.bottomRightPoint.y;
  }

  //grabbed from:
  //http://www.developingfor.net/c-20/testing-to-see-if-a-point-is-within-a-polygon.html
  //and
  //http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html#The%20C%20Code
  /**
   * Returns true if the point is inside this hexagon, it first uses the quick isInHexBounds contains, then check the boundaries
   * @param {Point} p the test point
   * @return {boolean}
   */
  public contains(p: Point): boolean {
    var isIn = false;
    if (this.isInHexBounds(p)) {
      //turn our absolute point into a relative point for comparing with the polygon's points
      //var pRel = new HT.Point(p.x - this.x, p.y - this.y);
      var i, j = 0;
      for (i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        var iP = this.points[i];
        var jP = this.points[j];
        if (
          (
            ((iP.y <= p.y) && (p.y < jP.y)) ||
            ((jP.y <= p.y) && (p.y < iP.y))
            //((iP.y > p.y) != (jP.y > p.y))
          ) &&
          (p.x < (jP.x - iP.x) * (p.y - iP.y) / (jP.y - iP.y) + iP.x)
        ) {
          isIn = !isIn;
        }
      }
    }
    return isIn;
  }

  private initNormalOrientation(): void {
    this.x1 = (this.hexParams.width - this.hexParams.side) / 2;
    this.y1 = (this.hexParams.height / 2);
    this.points.push(new Point(this.x1 + this.x, this.y));
    this.points.push(new Point(this.x1 + this.hexParams.side + this.x, this.y));
    this.points.push(new Point(this.hexParams.width + this.x, this.y1 + this.y));
    this.points.push(new Point(this.x1 + this.hexParams.side + this.x, this.hexParams.height + this.y));
    this.points.push(new Point(this.x1 + this.x, this.hexParams.height + this.y));
    this.points.push(new Point(this.x, this.y1 + this.y));
  }

  private initRotatedOrientation(): void {
    this.x1 = (this.hexParams.width / 2);
    this.y1 = (this.hexParams.height - this.hexParams.side) / 2;
    this.points.push(new Point(this.x1 + this.x, this.y));
    this.points.push(new Point(this.hexParams.width + this.x, this.y1 + this.y));
    this.points.push(new Point(this.hexParams.width + this.x, this.y1 + this.hexParams.side + this.y));
    this.points.push(new Point(this.x1 + this.x, this.hexParams.height + this.y));
    this.points.push(new Point(this.x, this.y1 + this.hexParams.side + this.y));
    this.points.push(new Point(this.x, this.y1 + this.y));
  }

  private drawStats(context: CanvasRenderingContext2D): void {
    context.strokeStyle = "black";
    context.lineWidth = 2;
    //draw our x1, y1, and z
    context.beginPath();
    context.moveTo(this.p1.x, this.y);
    context.lineTo(this.p1.x, this.p1.y);
    context.lineTo(this.x, this.p1.y);
    context.closePath();
    context.stroke();

    context.fillStyle = "black"
    context.font = "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif";
    context.textAlign = "left";
    context.textBaseline = 'middle';
    //var textWidth = ctx.measureText(this.Planet.BoundingHex.Id);
    context.fillText("z", this.x + this.x1 / 2 - 8, this.y + this.y1 / 2);
    context.fillText("x", this.x + this.x1 / 2, this.p1.y + 10);
    context.fillText("y", this.p1.x + 2, this.y + this.y1 / 2);
    context.fillText("z = " + this.hexParams.side, this.p1.x, this.p1.y + this.y1 + 10);
    context.fillText("(" + this.x1.toFixed(2) + "," + this.y1.toFixed(2) + ")", this.p1.x, this.p1.y + 10);
  }

  private setCanvasStyles(context): void {
    context.fillStyle = this.hexParams.styles.fillStyle
    context.font = this.hexParams.styles.font;
    context.textAlign = this.hexParams.styles.textAlign;
    context.textBaseline = this.hexParams.styles.textBaseline;
  }
}
