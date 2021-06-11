import type { Renderable } from "./Renderer";
import type { Point2D } from "../../model/type/Point";

export interface Shape extends Renderable {
    path: Path2D;
}

export class Circle implements Shape {
    private _path: Path2D;
    public center: Point2D;
    public radius: number;
    constructor(center: Point2D, radius: number) {
        this.radius = radius;
        this.center = center;
    }
    public get path(): Path2D {
        return this._path;
    }
    public render(ctx: CanvasRenderingContext2D): void;
    public render(ctx: WebGL2RenderingContext): void;
    public render(ctx: any): void {
        if (ctx instanceof CanvasRenderingContext2D) {
            this._path = new Path2D();
            this._path.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
            this._path.closePath();
        }
        else
            throw(new Error("Method not implemented."));
    }
}

export class Rectangle implements Shape {
    private _path: Path2D;
    first: Point2D;
    second: Point2D;
    constructor(first: Point2D, second: Point2D) {
        this.first = first;
        this.first = second;
    }
    public get path(): Path2D {
        return this._path;
    }
    public render(ctx: CanvasRenderingContext2D): void;
    public render(ctx: WebGL2RenderingContext): void;
    public render(ctx: any): void {
        if (ctx instanceof CanvasRenderingContext2D) {
            this._path = new Path2D();
            this._path.rect(this.first.x,
                this.first.y,
                this.second.x - this.first.x,
                this.second.y - this.first.y);
            this._path.closePath();
        }
        else
            throw(new Error("Method not impemented"));
    }
}

export abstract class ShapeDecorator implements Shape {
    protected shape: Shape;
    constructor(shape: Shape) {
        this.shape = shape;
    }
    public get path(): Path2D {
        return this.shape.path;
    }
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract render(ctx: WebGL2RenderingContext): void;
}

export class FilledRenderable extends ShapeDecorator {
    private color: string;
    constructor (shape: Shape, color: string) {
        super(shape);
        this.color = color;
    }
    render(ctx: CanvasRenderingContext2D): void;
    render(ctx: WebGL2RenderingContext): void;
    render(ctx: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            this.shape.render(ctx);
            ctx.fillStyle = this.color;
            ctx.fill(this.path);
        }
        else
            throw(new Error("Method not implemented"));
    }
}

export class StrokedRenderable extends ShapeDecorator {
    private color: string;
    constructor (shape: Shape, color: string) {
        super(shape);
        this.color = color;
    }
    render(ctx: CanvasRenderingContext2D): void;
    render(ctx: WebGL2RenderingContext): void;
    render(ctx: any) {
        if (ctx instanceof CanvasRenderingContext2D) {
            this.shape.render(ctx);
            ctx.strokeStyle = this.color;
            ctx.stroke(this.path);
        }
        else
            throw(new Error("Method not implemented"));
    }
}