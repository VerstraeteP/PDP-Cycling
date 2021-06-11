export interface Renderable {
    render(ctx: CanvasRenderingContext2D): void;
    render(ctx: WebGL2RenderingContext): void;
}

export class Renderer {
    private _canvas: HTMLCanvasElement;
    private _context: any;
    private renderables: Array<[Renderable, number]> = [];

    public constructor(canvas: HTMLElement, context: "2d" | "webgl") {
        this._canvas = canvas as HTMLCanvasElement;
        this._context = this._canvas.getContext(context);
    }

    public get canvas() {
        return this._canvas;
    }

    public enqueue(renderable: Renderable, layer?: number): void {
        if (layer === undefined) layer = 0;
        this.renderables.push([renderable, layer]);
        this.renderables.sort((a, b) => (a[1] < b[1]) ? -1 : (a[1] == b[1]) ? 0 : 1);
    }

    public dequeue(renderable: Renderable): void {
        let i: number = 0;
        for (; i < this.renderables.length; i++)
            if (this.renderables[i][0] === renderable) break;
        if (i == this.renderables.length)
            throw new Error("Renderable not in render queue");
        this.renderables.splice(i, 1);
    }

    public render(): void {
        this.clearCanvas();
        for (let i = 0; i < this.renderables.length; i++) {
            try {
                this.renderables[i][0].render(this._context);
            } catch (error) {
                console.log(error);
            }
        }
    }

    public set context(context: "2d" | "webgl") {
        this._context = this.canvas.getContext(context)
    }

    private clearCanvas(): void {
        if (this._context instanceof CanvasRenderingContext2D) {
            this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        else
            throw new Error("Method not implemented.");
    }
    
}