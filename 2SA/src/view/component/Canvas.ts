import { Component } from "./Component";

/**
 * Wrapper around canvas element that automatically updates size (for correct resolution of content)
 */
export class Canvas implements Component {
    private _content: HTMLElement;
    public constructor() {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;
        window.addEventListener("resize", () => {
            if (canvas.parentElement == undefined) return;
            /*
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height =canvas.parentElement.offsetHeight;
            */
           canvas.title="eerste"
            canvas.width=500;
            canvas.height=500;
        })
        this._content = canvas;
    }
    public get content() {
        return this._content;
    }
}
