import { Point2D } from "../model/type/Point";
import type { DataFitter } from "./DataFitter";
import type { Renderable, Renderer } from "../view/render/Renderer";

export class DataGrid implements Renderable {
    private fitter: DataFitter;
    private scale: number = 50;

    public constructor(fitter: DataFitter) {
        this.fitter = fitter;
    }

    public setScale(scale: number): void {
        this.scale = scale;
    }

    public getScale(): number {
        return this.scale;
    }

    private renderGrid(ctx: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            const size = this.fitter.resolution;
            let origin: Point2D;
            try {
                origin = this.fitter.fit({x: 0, y: 0});
            } catch {
                origin = {x: 0, y: size[1]};
            }
            const grid = new Path2D();
            // vertical
            const x = Math.abs(origin.x % (this.scale / 2));
            for (let i = 0; x + this.scale / 2 * i < size[0]; i++) {
                grid.moveTo(x + i * this.scale / 2, 0);
                grid.lineTo(x + i * this.scale / 2, ctx.canvas.height);
            }
            // horizontal
            const y = Math.abs(origin.y % (this.scale / 2));
            for (let i = 0; y + this.scale / 2 * i < size[1]; i++) {
                grid.moveTo(0, y + i * this.scale / 2);
                grid.lineTo(ctx.canvas.width, y + i * this.scale / 2);
            }
            ctx.strokeStyle = "#efefef";
            ctx.stroke(grid);
        }
        else
            throw new Error("Method not implemented.");
    }

    private renderAxes(ctx: any) {
       
    }

    public render(ctx: any) {
        this.renderGrid(ctx);
        this.renderAxes(ctx);
    }
}
