import type { DataPoint2D } from "../model/type/Data";
import type { DataFitter } from "./DataFitter";
import { DataSet, DataUser } from "../model/DataSet";
import type { Renderable } from "../view/render/Renderer";
import { Point2D } from "../model/type/Point";

export interface DataStyler {

    style(datapoint: DataPoint2D, coords: Point2D): Renderable;
}

export class DataAnimation extends DataUser implements Renderable {
    private frames: Array<Array<DataPoint2D>> = [];
    public races:any
    private _styler: DataStyler;
    private fitter: DataFitter;
    public canvasname;
    private _frameNo: number;
    private title: HTMLElement ;
    public constructor (dataset: DataSet, fitter: DataFitter, styler: DataStyler, canvasname:any, races:any) {
        super(dataset);
       this.races=races;
        this.fitter = fitter;
        this._styler = styler;
        this.canvasname=canvasname;
        this.races=races;
        this.title= document.getElementById(this.canvasname)
        
        
    }

    public set frameNo(frameNo: number) {
        this._frameNo = frameNo;
    }

    public get noFrames() {
        return this.frames.length;
    }

    public set styler(styler: DataStyler) {
        this._styler = styler;
    }

    public time(frameNo: number): number {
        return (this.frames.length > 0) ? this.frames[frameNo][0].time : 0;
    }

    public render(ctx: any) {
        // advantage of making animator renderable: no need to individually remove circles from renderqueue
        if (ctx instanceof CanvasRenderingContext2D) {
         
            if (this.frames.length > 0) {
                for (let i = 0; i < this.frames[this._frameNo].length; i++) {
                    const current: DataPoint2D = this.frames[this._frameNo][i];
                    this._styler.style(current, this.fitter.fit(current.point)).render(ctx);
                }
            }
        }
        else throw new Error("Method not implemented")
    }

    public update() {
        console.log("ANIMATOR: Making frames...");
        let start = performance.now();
        let data = this.dataset.data 
        let names = new Set<string>()
        console.log(this.dataset.info.confs)
        for( var k in this.dataset.info.confs){
        console.log(k.split(".")[0])
        names.add(k.split(".")[0])
        }
        console.log(names)
        var arr = this.races[this.canvasname].split("_"); 
        console.log(arr)     // Split the string using dot as separator
	var lastVal = arr.pop(); 
        this.title.textContent = lastVal;
        // insert into array (assume sorted)
        this.frames = [[data[0]]]
        console.log("canvasname")
        console.log(this.races)
        console.log(this.races[this.canvasname])
        for (let i = 1, j = 0; i < data.length; i++) {
        	if (data[i].visible==true && data[i].conf.split(".")[0]==this.races[this.canvasname] && data[i].visible_points==true){
            if (Math.abs(data[i].time - this.frames[j][0].time) > 1E-6) {
                j++;
                this.frames.push([]);
            }
            this.frames[j].push(data[i]);
        }
        }
        console.log(this.frames)
        let stop = performance.now();
        console.log("ANIMATOR: Done making frames in " + (stop - start) + " miliseconds.");
    }
}
