import type { Component } from "./component/Component";

export class Dialog {
    private content: HTMLElement = document.createElement("div");

    private titleHead: HTMLHeadElement = document.createElement("h1");
    private OKButton: HTMLButtonElement = document.createElement("button");

    public constructor(component: Component, callOnClose: Function) {
        // setup style main container
        this.content.classList.add("dialog-grey-out");
        // setup style dialog window
        const window = document.createElement("div");
        window.classList.add("dialog-window");
        // button setup
        this.OKButton.textContent = "OK";
        this.OKButton.addEventListener("click", () => this.close());
        this.OKButton.addEventListener("click", () => callOnClose());
        // make tree
        this.content.appendChild(window);
        window.appendChild(this.titleHead);
        window.appendChild(component.content);
        window.appendChild(this.OKButton);
    }

    public set title(title: string) {
        this.titleHead.textContent = title;
    }

    public set buttonText(text: string) {
        this.OKButton.textContent = text;
    }

    public show(): void {
        document.body.appendChild(this.content);
    }

    public close(): void {
        document.body.removeChild(this.content);
    }

}