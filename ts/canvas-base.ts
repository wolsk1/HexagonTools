import { CanvasSettings } from './hexagon.model';

export abstract class CanvasBase {
  constructor(
    protected canvasSettings: CanvasSettings
  ) { }

  protected getCanvas2DContext(canvasId: string): CanvasRenderingContext2D {
    let canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    return canvas.getContext('2d');
  }

  protected clearCanvas(): CanvasRenderingContext2D {
    let canvasContext = this.getCanvas2DContext(this.canvasSettings.id);
    canvasContext.clearRect(0, 0, this.canvasSettings.width, this.canvasSettings.height);

    return canvasContext;
  }
}
