import { Component } from "./Component";

enum PlayState {
    playing,
    paused
}

export class AnimationControls implements Component {
    private static PLAY_ICON_SRC = "./icons/play_arrow-24px.svg";
    private static FASTER_ICON_SRC = "./icons/fast_forward-black-18dp.svg";
    private static SLOWER_ICON_SRC = "./icons/fast_rewind-black-18dp.svg";
    private static PAUSE_ICON_SRC = "./icons/pause-black-18dp.svg";

    private _content: HTMLElement = document.createElement("div");

    private _timeSlider: HTMLInputElement;
    private _playButton: HTMLButtonElement;
    private _fasterButton: HTMLButtonElement;
    private _slowerButton: HTMLButtonElement;
    private _speedText: HTMLSpanElement;
    private _timeRemainingText: HTMLSpanElement;
    private _timeCurrentText: HTMLSpanElement;

    private _timestampText: HTMLSpanElement;

    private state: PlayState = PlayState.paused;

    public constructor() {
        this._timeSlider = document.createElement("input");
        this._timeSlider.type = "range";
        this._timeSlider.min = "0";
        this._timeSlider.max = "0";
        this._playButton = document.createElement("button");
        this._playButton.appendChild(document.createElement("img")).src = AnimationControls.PLAY_ICON_SRC;
        this._playButton.addEventListener("click", () => {
            const img: HTMLImageElement = this._playButton.firstChild as HTMLImageElement
            if (this.state == PlayState.paused) {
                img.src = AnimationControls.PAUSE_ICON_SRC;
                this.state = PlayState.playing;
            }
            else {
                img.src = AnimationControls.PLAY_ICON_SRC;
                this.state = PlayState.paused;
            }
        })
        this._fasterButton = document.createElement("button");
        this._fasterButton.appendChild(document.createElement("img")).src = AnimationControls.FASTER_ICON_SRC;
        this._slowerButton = document.createElement("button");
        this._slowerButton.appendChild(document.createElement("img")).src = AnimationControls.SLOWER_ICON_SRC;
        this._speedText = document.createElement("span");
        this._timestampText = document.createElement("span");
        this._timeRemainingText = document.createElement("span");
        this._timeRemainingText.textContent = "00:00:00";
        this._timeCurrentText = document.createElement("span");
        this._timeCurrentText.textContent = "00:00:00";
        const sliderContainer = document.createElement("div");
        sliderContainer.classList.add("animation-controls-slider");
        sliderContainer.append(this._timeCurrentText, this._timeSlider, this._timeRemainingText);
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("animation-controls-buttons");
        buttonContainer.append(this._slowerButton, this._playButton, this._fasterButton);
        const timestampContainer = document.createElement("div");
        timestampContainer.append(document.createTextNode("timestamp: "), this._timestampText);
        const speedContainer = document.createElement("div");
        speedContainer.append(document.createTextNode("speed: "), this._speedText);
        this._content.append(sliderContainer, buttonContainer, timestampContainer, speedContainer);
    }

    public get content(): HTMLElement {
        return this._content;
    }

    public get timeSlider() {
        return this._timeSlider;
    }

    public get playButton() {
        return this._playButton
    }

    public get fasterButton() {
        return this._fasterButton;
    }

    public get slowerButton() {
        return this._slowerButton;
    }

    public get speedText() {
        return this._speedText;
    }

    public get timeRemainingText() {
        return this._timeRemainingText;
    }

    public get timeCurrentText() {
        return this._timeCurrentText;
    }

    public get timestampText() {
        return this._timestampText;
    }
}