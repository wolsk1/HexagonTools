import { HexParams, HexagonOrientation, CanvasSettings, HEX_STYLES } from './hexagon.model';
import { Hexagon } from './hexagon';
import { CanvasBase } from './canvas-base';

export abstract class HexBase extends CanvasBase {
  constructor(
    canvasSettings: CanvasSettings
  ) { super(canvasSettings); }

  protected addHexToCanvasAndDraw(x: number, y: number, hexParams: HexParams, displayStats: boolean = false): void {
    const hex = new Hexagon(null, x, y, hexParams, displayStats);
    const canvasContext = this.clearCanvas();
    hex.draw(canvasContext);
  }

  public findHexWithSideLengthZAndRatio(
    sideLength: number,
    whRatio: number,
    orientation: HexagonOrientation
  ): HexParams {
    const z = parseFloat(sideLength.toString()); //TODO refactor later
    const r = parseFloat(whRatio.toString());

    //solve quadratic
    const r2 = Math.pow(r, 2);
    const a = (1 + r2) / r2;
    const b = z / r2;
    const c = ((1 - 4.0 * r2) / (4.0 * r2)) * (Math.pow(z, 2));

    const x = (-b + Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);
    const y = ((2.0 * x) + z) / (2.0 * r);

    const width = ((2.0 * x) + z);
    const height = (2.0 * y);
    const hexagonParams = new HexParams(width, height, z, orientation, HEX_STYLES);

    return hexagonParams;
  }

  public findHexWithWidthAndHeight(
    hexWidth: number,
    hexHeight: number,
    orientation: HexagonOrientation
  ): HexParams {
    const width = parseFloat(hexWidth.toString());
    const height = parseFloat(hexHeight.toString());
    const y = height / 2.0;

    //solve quadratic
    const a = -3.0;
    const b = (-2.0 * width);
    const c = (Math.pow(width, 2)) + (Math.pow(height, 2));

    const z = (-b - Math.sqrt(Math.pow(b, 2) - (4.0 * a * c))) / (2.0 * a);
    const x = (width - z) / 2.0;

    const hexagonParams = new HexParams(width, height, z, orientation, HEX_STYLES);

    return hexagonParams;
  }
}
