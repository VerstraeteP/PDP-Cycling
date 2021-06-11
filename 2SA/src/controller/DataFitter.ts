import type { Point2D } from "../model/type/Point";
import { DataSet, DataUser } from "../model/DataSet";
import { Renderer } from "../view/render/Renderer";

export class DataFitter extends DataUser {
    private canvas: HTMLCanvasElement;
    private scaling: number;

    private _interaction: FitterInteraction;

    public constructor(dataset: DataSet, renderer: Renderer) {
        super(dataset);
        this.canvas = renderer.canvas;
        this._interaction = new FitterInteraction(renderer);
    }

    public get resolution(): [number, number] {
        return [this.canvas.width, this.canvas.height];
    }

    public get interaction(): FitterInteraction {
        return this._interaction;
    }

    public update() {
        if (this.dataset.data.length < 1) return;
        const size = [this.canvas.width, this.canvas.height];
        const min = this.dataset.info.min;
        const max = this.dataset.info.max;
        // problem when max == min!
        let rx = size[0] / (max[0] - min[0]);
        let ry = size[1] / (max[1] - min[1]);
        this.scaling = (rx < ry) ? rx : ry;
    }

    public fit(point: Point2D): Point2D {
        if (this.dataset.data.length < 1)
            throw new Error("Dataset is empty.");
        const size = [this.canvas.width, this.canvas.height];
        const min = this.dataset.info.min;
        const center = [this._interaction.centerX, this._interaction.centerY]
        // zoom around point, there seems to be a little offset from the current point of the cursor...
        return {
            x: (this._interaction.zoom * (this.scaling * (point.x - min[0]) + this._interaction.offsetX - center[0])) + center[0],
            y: (this._interaction.zoom * (-(this.scaling) * (point.y - min[1]) + size[1] + this._interaction.offsetY - center[1])) + center[1]
        };
    } 

    public inverseFit(point: Point2D): Point2D {
        if (this.dataset.data.length < 1)
            throw new Error("Dataset is empty.");
        const size = [this.canvas.width, this.canvas.height];
        const min = this.dataset.info.min;
        const center = [this._interaction.centerX, this._interaction.centerY]
        return {
            x: ((point.x - center[0]) / this._interaction.zoom - this._interaction.offsetX + center[0]) / (this.scaling) + min[0],
            y: -((point.y - center[1]) / this._interaction.zoom - size[1] - this._interaction.offsetY + center[1]) / (this.scaling) + min[1]
        };
    }

}

class FitterInteraction {
    private canvas: HTMLCanvasElement;
    private renderer: Renderer;
    private _active: boolean = false;

    private _offsetX: number = 0;
    private _offsetY: number = 0;

    private _zoom: number = 1;
    private _centerX: number = 0;
    private _centerY: number = 0;

    private startHandler = () => {
        this.canvas.addEventListener("mouseup", this.cancelHandler);
        this.canvas.addEventListener("mouseleave", this.cancelHandler);
        this.canvas.addEventListener("mousemove", this.panHandler);
        this.canvas.removeEventListener("mousedown", this.startHandler);
    }

    private cancelHandler = () => {
        this.canvas.removeEventListener("mouseup", this.cancelHandler);
        this.canvas.removeEventListener("mouseleave", this.cancelHandler);
        this.canvas.removeEventListener("mousemove", this.panHandler);
        this.canvas.addEventListener("mousedown", this.startHandler);
    }

    private panHandler = (ev: MouseEvent) => {
        this._offsetX += ev.movementX;
        this._offsetY += ev.movementY;
        this.renderer.render();
    }

    private zoomHandler = (ev: WheelEvent) => {
        this._centerX = ev.offsetX;
        this._centerY = ev.offsetY;
        this._zoom = Math.min(Math.max(0.125, this._zoom - 0.001 * ev.deltaY), 4); // lower and upper bounds .125 and 4
        this.renderer.render();
    }

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.canvas = renderer.canvas;
    }
    public get offsetX() {
        return this._offsetX;
    }
    public get offsetY() {
        return this._offsetY;
    }
    public get zoom() {
        return this._zoom;
    }
    public get centerX() {
        return this._centerX;
    }
    public get centerY() {
        return this._centerY;
    }
    public set active(active: boolean) {
        if (active == this._active) return;
        this._active = active;
        if (this._active) {
            this.canvas.addEventListener("mousedown", this.startHandler);
            this.canvas.addEventListener("wheel", this.zoomHandler);
        }
        else {
            this.canvas.removeEventListener("mousedown", this.startHandler);
            this.canvas.removeEventListener("wheel", this.zoomHandler);
        }
    }
    public reset() {
        this._offsetX = 0;
        this._offsetY = 0;
        this._zoom = 1;
        this._centerX = 0;
        this._centerY = 0;
    }
}