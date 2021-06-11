import type { AnimationControls } from "../view/component/AnimationControls";
import type { DataAnimation } from "./DataAnimation";
import { DataSet, DataUser } from "../model/DataSet";
import { Renderer } from "../view/render/Renderer";

enum PlayState {
    paused,
    playing
}

export class DataAnimator extends DataUser {
    private view: AnimationControls;

    private animation: DataAnimation;
    private renderer: Renderer;
    
    private _fps: number = 1;
    private speed: number = 1;

    private handle: number;

    private state: PlayState = PlayState.paused;

    constructor(dataset: DataSet, view: AnimationControls, animation: DataAnimation, renderer: Renderer) {
        super(dataset);
        this.view = view;
        this.animation = animation;
        this.renderer = renderer;
        this.renderer.enqueue(animation);
        // initialize view functions
        this.view.timeSlider.addEventListener("input", () => this.showCurrentFrame());
        this.view.playButton.addEventListener("click", () => this.updateState());
        this.view.fasterButton.addEventListener("click", () => this.changeSpeed(1));
        this.view.slowerButton.addEventListener("click", () => this.changeSpeed(-1));
        this.view.speedText.textContent =  "x" + this._fps.toString();
        // initialize view display
        this.view.timeSlider.value = "0";
    }

    public showCurrentFrame(): void {
        this.animation.frameNo = this.view.timeSlider.valueAsNumber;
        this.updateTimestamps(this.view.timeSlider.valueAsNumber);
        this.renderer.render();
    }

    update(): void {
        this.view.timeSlider.max = "" + (this.animation.noFrames - 1);
        this.slider = 0;
    }

    private set slider(frameNo: number) {
        this.view.timeSlider.value = frameNo.toString();
        this.showCurrentFrame();
    }

    private updateTimestamps(frameNo: number) {
        const current = this.animation.time(frameNo) - this.animation.time(0);
        this.view.timeCurrentText.textContent = Math.floor(current / 3600) + new Date(current * 1000).toISOString().substr(13, 10);
        const remaining = this.animation.time(this.animation.noFrames - 1) - this.animation.time(frameNo);
        this.view.timeRemainingText.textContent = Math.floor(remaining / 3600) +  new Date(remaining * 1000).toISOString().substr(13, 10);
        this.view.timestampText.textContent = (this.dataset.timeDate) ?  new Date(this.animation.time(frameNo) * 1000).toUTCString() : this.animation.time(frameNo).toString();
    }

    private updateState(): void {
        switch(this.state) {
            case PlayState.paused:
                this.state = PlayState.playing;
                this.handle = window.setInterval(() =>
                    this.slider = (this.view.timeSlider.valueAsNumber + 1) % (Number(this.view.timeSlider.max) + 1)
                , 1000 / this._fps);
                break;
            case PlayState.playing:
                this.state = PlayState.paused;
                clearInterval(this.handle);
                break;
        }
    }

    private changeSpeed(direction: -1 | 1): void {
        this._fps *= Math.pow(2, direction);
        this.speed *= Math.pow(2, direction);
        this.view.speedText.textContent = "x" + this.speed;
        // reset interval
        this.updateState();
        this.updateState();
    }

    public set fps(fps: number) {
        if (fps > 0) {
            this._fps = fps;
            this.speed = 1;
            this.view.speedText.textContent = "x" + this.speed;
            this.updateState();
            this.updateState();
        }
        else throw Error("Not a valid fps");
    }
}