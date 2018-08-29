export enum HexagonOrientation { //TODO refactor as boolean
  normal,
  rotated
};

export const HEXAGON_CONSTANTS = {
  HEIGHT: 91.14378277661477,
  WIDTH: 91.14378277661477,
  SIDE: 50.0,
  ORIENTATION: HexagonOrientation.normal,
  DRAWSTATS: false
};//hexagons will have 25 unit sides for now

export const HEX_STYLES: CanvasStyles = {
  fillStyle: "black",
  font: "bolder 8pt Trebuchet MS,Tahoma,Verdana,Arial,sans-serif",
  textAlign: 'center',
  textBaseline: 'middle'
};

/**
 * A Point is simply x and y coordinates
 * @constructor
 */
export class Point {
  constructor(
    public x: number,
    public y: number
  ) { }
}

/**
 * A Rectangle is x and y origin and width and height
 * @constructor
 */
export class Rectangle {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) { }
}

/**
   * A Line is x and y start and x and y end
   * @constructor
   */
export class Line {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number, public y2: number
  ) { }
}

export class HexParams {
  constructor(
    public width: number,
    public height: number,
    public side: number,
    public orientation: HexagonOrientation = HexagonOrientation.normal,
    public styles?: CanvasStyles,
    public displayStats: boolean = false
  ) { }
}

export class CanvasStyles {
  fillStyle?: string;
  font?: string;
  textAlign?: string;
  textBaseline?: string;
}

export class CanvasSettings {
  constructor(
    public id: string,
    public width: number,
    public height: number
  ){}
}
