import {
  HexagonOrientation,
  HEXAGON_CONSTANTS,
  Point,
  HexParams,
  CanvasSettings
} from './hexagon.model';
import { Hexagon } from './hexagon';
import { GRID_CONSTANTS } from './grid.model';
import { HexBase } from './hex-base';

export class HexGrid extends HexBase {
  /**
 * A Grid is the model of the playfield containing hexes
 * @constructor
 * @param canvasId {string} grid canvas id
 * @param width {number} width of the grid
 * @param height {number} height of the grid
 */
  constructor(
    canvasId: string,
    width: number,
    height: number
  ) {
    super(new CanvasSettings(canvasId, width, height));
    this.hexes = [];
  }

  public hexes: Hexagon[];
  public hexParams: HexParams;

  public getHexId(row: number, col: number): string {
    let letterIndex = row;
    let letters = "";
    while (letterIndex > 25) {
      letters = GRID_CONSTANTS.Letters[letterIndex % 26] + letters;
      letterIndex -= 26;
    }

    return GRID_CONSTANTS.Letters[letterIndex] + letters + (col + 1);
  }

  /**
 * Returns a hex at a given point
 * @param point {Point} point
 * @return {Hexagon}
 */
  public getHexAt(point: Point) {
    //TODO possible to refactor using lodash foreach
    //find the hex that contains this point
    for (let h in this.hexes) {
      if (this.hexes[h].contains(point)) {
        return this.hexes[h];
      }
    }

    return null;
  }

  /**
 * Returns a distance between two hexes
 * @param h1 {Hexagon}
 * @param h2 {Hexagon}
 * @return {number}
 */
  public getHexDistance(h1: Hexagon, h2: Hexagon): number {
    //a good explanation of this calc can be found here:
    //http://playtechs.blogspot.com/2007/04/hex-grids.html
    const deltaX = h1.PathCoOrdX - h2.PathCoOrdX;
    const deltaY = h1.PathCoOrdY - h2.PathCoOrdY;
    return ((Math.abs(deltaX) + Math.abs(deltaY) + Math.abs(deltaX - deltaY)) / 2);
  };

  /**
   * Returns a distance between two hexes
   * @param id {string} hex id
   * @return {Hexagon}
   */
  public getHexById(id: string): Hexagon {
    //TODO Possible to refactor using lodash foreach
    for (let i in this.hexes) {
      if (this.hexes[i].id == id) {
        return this.hexes[i];
      }
    }

    return null;
  };

  /**
  * Returns the nearest hex to a given point
  * Provided by: Ian (Disqus user: boingy)
  * @param p {Point} p the test point 
  * @return {Hexagon}
  */
  public getNearestHex(p: Point): Hexagon {
    let distance;
    let minDistance = Number.MAX_VALUE;
    let closestHex = null;

    // iterate through each hex in the grid
    this.hexes.forEach(hex => {
      distance = hex.distanceFromMidPoint(p);

      if (distance < minDistance) // if this is the nearest thus far
      {
        minDistance = distance;
        closestHex = hex;
      }
    });

    return closestHex;
  }

  public draw(hexParams: HexParams): void {
    if(!hexParams){
      throw new Error('hex parameters are not defined');
    }     
    if(this.hexParams !== hexParams){
      this.initHexes(hexParams);
    }

    const canvasContext = this.clearCanvas();
    this.hexes.forEach(hex => hex.draw(canvasContext))
  }

  public initHexes(hexParams: HexParams): void {
    this.hexes = [];
    this.hexParams = hexParams;
    //setup a dictionary for use later for assigning the X or Y CoOrd (depending on Orientation)
    const HexagonsByXOrYCoOrd: HexCoordinates = {}; //Dictionary<int, List<Hexagon>>
    let row = 0;
    let y = 0.0;

    while (y + this.hexParams.height <= this.canvasSettings.height) {
      let col = 0;
      let offset = 0.0;

      if (row % 2 == 1) {
        offset = this.getOffset();
        col = 1;
      }

      let x = offset;
      while (x + this.hexParams.width <= this.canvasSettings.width) {
        let hexId = this.getHexId(row, col);
        let hex = new Hexagon(hexId, x, y, this.hexParams);
        let pathCoOrd = col;

        if (this.hexParams.orientation == HexagonOrientation.normal)
          //the column is the x coordinate of the hex, for the y coordinate we need to get more fancy
          hex.PathCoOrdX = col;
        else {
          hex.PathCoOrdY = row;
          pathCoOrd = row;
        }

        this.hexes.push(hex);

        if (!HexagonsByXOrYCoOrd[pathCoOrd]) {
          HexagonsByXOrYCoOrd[pathCoOrd] = [];
        }

        HexagonsByXOrYCoOrd[pathCoOrd].push(hex);
        col += 2;
        x += this.getXStep();
      }

      row++;
      y += this.getYStep();
    }

  }

  private getOffset(): number {
    return this.hexParams.orientation == HexagonOrientation.normal
      ? (this.hexParams.width - this.hexParams.side) / 2 + this.hexParams.side
      : this.hexParams.width / 2;
  }

  private getXStep(): number {
    return this.hexParams.orientation == HexagonOrientation.normal
      ? this.hexParams.width + this.hexParams.side
      : this.hexParams.width;
  }

  private getYStep(): number {
    return this.hexParams.orientation == HexagonOrientation.normal
      ? this.hexParams.height / 2
      : (this.hexParams.height - this.hexParams.side) / 2 + this.hexParams.side;
  }  

  private setHexNames(hexagonRows: HexCoordinates): void {
    //finally go through our list of hexagons by their x co-ordinate to assign the y co-ordinate
    for (let x in hexagonRows) {
      let xVal = parseInt(x);
      let hexagonsByXOrY = hexagonRows[x];
      let y = Math.floor(xVal / 2) + (xVal % 2);
      for (var i in hexagonsByXOrY) {
        var h = hexagonsByXOrY[i];//Hexagon
        if (this.hexParams.orientation == HexagonOrientation.normal)
          h.PathCoOrdY = y++;
        else
          h.PathCoOrdX = y++;
      }
    }
  }
}

type HexCoordinates = { [pathtoCoord: number]: Hexagon[] }
