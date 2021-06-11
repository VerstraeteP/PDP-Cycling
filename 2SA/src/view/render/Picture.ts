import { DataFitter } from "../../controller/DataFitter";
import { Point2D } from "../../model/type/Point";
import { Renderable } from "./Renderer";

export class Picture implements Renderable {
    protected picture: HTMLImageElement;
    public dx: number = 0;
    public dy: number = 0;
    protected dw: number;
    protected dh: number;
    constructor(picture: HTMLImageElement) {
        this.picture = picture;
        this.dw = picture.width;
        this.dh = picture.height;
    }
    render(ctx: CanvasRenderingContext2D): void;
    render(ctx: WebGL2RenderingContext): void;
    render(ctx: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            ctx.drawImage(this.picture, this.dx, this.dy, this.dw, this.dh);
        }
        else
            throw new Error("Method not implemented.");
    }
    
}

export class FixedPicture extends Picture {
    private fitter: DataFitter;
    constructor(picture: HTMLImageElement, fitter: DataFitter, x1: number, y1: number, x2: number, y2: number) {
        super(picture);
        this.fitter = fitter;
        this.dx = x1;
        this.dy = y1;
        this.dw = x2 - x1;
        this.dh = y2 - y1;
    }
    render(ctx: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            let leftUp: Point2D;
            let rightDown: Point2D;
            try {
                leftUp = this.fitter.fit({x: this.dx, y: this.dy});
                rightDown = this.fitter.fit({x: this.dx + this.dw, y: this.dy + this.dh})
            } catch {
                // put at origin
                leftUp = {x: 0, y: 0};
                rightDown = {x: this.dw, y: this.dh}
            }
            ctx.drawImage(this.picture, leftUp.x, leftUp.y, rightDown.x - leftUp.x, rightDown.y - leftUp.y);
        }
        else
            throw new Error("Method not implemented.");
    }
}