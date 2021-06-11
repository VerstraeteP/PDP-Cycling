import { Component } from "./Component";

export class PictureInput implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _fileInput: HTMLInputElement = document.createElement("input");
    private _upperLeftInputX: HTMLInputElement = document.createElement("input");
    private _upperLeftInputY: HTMLInputElement = document.createElement("input");
    private _lowerRightInputX: HTMLInputElement = document.createElement("input");
    private _lowerRightInputY: HTMLInputElement = document.createElement("input");
    public constructor() {
        const fileInputText = document.createElement("span");
        fileInputText.textContent = "Select a picture: ";
        this._fileInput.type = "file";
        this._fileInput.accept = "image/*";
        const fileInputButton = document.createElement("button");
        fileInputButton.textContent = "Search";
        fileInputButton.addEventListener("click", () => this._fileInput.click());
        const upperLeftText = document.createElement("p");
        upperLeftText.textContent = "Give the x- and y- coördinates of where the upper left corner of the picture should be:";
        const upperLeftForm = document.createElement("form");
        this._upperLeftInputX.type = "number";
        this._upperLeftInputX.value = "0";
        this._upperLeftInputY.type = "number";
        this._upperLeftInputY.value = "0";
        upperLeftForm.append(this._upperLeftInputX, this._upperLeftInputY);
        const lowerRightText = document.createElement("p");
        lowerRightText.textContent = "Give the x- and y- coördinates of where the lower right corner of the picture should be:";
        const lowerRightForm = document.createElement("form");
        this._lowerRightInputX.type = "number";
        this._lowerRightInputX.value = "0";
        this._lowerRightInputY.type = "number";
        this._lowerRightInputY.value = "0";
        lowerRightForm.append(this._lowerRightInputX, this._lowerRightInputY);
        this._content.append(fileInputText, fileInputButton, upperLeftText, upperLeftForm, lowerRightText, lowerRightForm);
    }
    public get content() {
        return this._content;
    }
    public get fileInput() {
        return this._fileInput;
    }
    public get upperLeftInputX() {
        return this._upperLeftInputX;
    }
    public get upperLeftInputY() {
        return this._upperLeftInputY;
    }
    public get lowerRightInputX() {
        return this._lowerRightInputX;
    }
    public get lowerRightInputY() {
        return this._lowerRightInputY;
    }
}