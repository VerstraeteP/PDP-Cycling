import { Rectangle, StrokedRenderable } from "../view/render/Shape";
import type { Point2D } from "../model/type/Point";
import type { Renderable, Renderer } from "../view/render/Renderer";

enum DrawState {
    static,
    drawing,
    terminated
}

export class RectangleDrawer {
    // add snap controller
    private renderer: Renderer;
    private state: DrawState = DrawState.static;
    private selection: Rectangle;
    private renderable: Renderable;
    private handler: (first: Point2D, second: Point2D) => void;
    public constructor(renderer: Renderer, handler: (first: Point2D, second: Point2D) => void) {
        this.renderer = renderer;
        renderer.canvas.addEventListener("mousedown", (event: MouseEvent) => this.updateState(event));
        renderer.canvas.addEventListener("mousemove", (event: MouseEvent) => this.updateState(event));
        renderer.canvas.addEventListener("mouseup", (event: MouseEvent) => this.updateState(event));
        renderer.canvas.addEventListener("mouseout", (event: MouseEvent) => this.updateState(event));
        this.handler = handler;
    }
    public updateState(event: MouseEvent): void {
        switch(this.state) {
            case DrawState.static:
                if (event.type === "mousedown") {
                    this.state = DrawState.drawing;
                    this.selection = new Rectangle({x: event.offsetX, y: event.offsetY}, {x: event.offsetX, y: event.offsetY});
                    this.renderable = new StrokedRenderable(this.selection, "#000000");
                    this.renderer.enqueue(this.renderable);
                }
                break;
            case DrawState.drawing:
                if (event.type === "mousemove") {
                    this.selection.second = {x: event.offsetX, y: event.offsetY};
                }
                else {
                    if (event.type === "mouseup") {
                        this.handler(this.selection.first, this.selection.second);
                        this.state = DrawState.terminated;
                    }
                    else
                        this.state = DrawState.static;
                    this.renderer.dequeue(this.renderable);
                }
                this.renderer.render();
                break;
        }
    }
    public getCoordiantes(): Point2D[] {
        return [this.selection.first, this.selection.second];
    }
}
