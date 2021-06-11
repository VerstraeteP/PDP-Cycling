import { Component } from "./Component";

export class MapGeneration implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _checked: boolean = false;
    public constructor() {
        const text: HTMLSpanElement = document.createElement("span");
        text.textContent = "Confirm that the data coördinates are expressed in latitude and longitude"
        const checkbox: HTMLInputElement = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.marginLeft = "5px";
        checkbox.addEventListener("change", () => this._checked = checkbox.checked);
        this._content.append(text, checkbox);
    }
    public get content() {
        return this._content;
    }
    public get checked() {
        return this._checked;
    }
}