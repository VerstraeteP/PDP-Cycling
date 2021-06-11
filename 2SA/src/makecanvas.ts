import { ConfigurationStyler } from "./controller/ConfigurationStyler";
import { DataSet } from "./model/DataSet";
import { Renderer } from "./view/render/Renderer";
import { Dropdown, DropdownButton, DropdownMenu, DropdownSeperator, DropdownSubMenu } from "./view/component/Dropdown";
import { DataFitter } from "./controller/DataFitter";
import { DataAnimation } from "./controller/DataAnimation";
import { Interpolator } from "./model/dataprocessor/Interpolator";
import { DataLoader } from "./controller/DataLoader";
import { AnimationControls } from "./view/component/AnimationControls";
import { DataGrid } from "./controller/DataGrid";
import { DataAnimator } from "./controller/DataAnimator";

import { Canvas } from "./view/component/Canvas";
import { Temporal_Interval, Spatial_Point_Of_View, Moving_through_rectangle_entering, Moving_through_rectangle_leaving, Spatial_EndPoint, Spatial_StartPoint, Temporal_EndTime, Temporal_StartTime } from "./model/dataprocessor/Snaps";
import { RectangleDrawer } from "./controller/RectangleDrawer";
import { Dialog } from "./view/Dialog";
import { DataExporter } from "./controller/DataExporter";
import { FixedPicture } from "./view/render/Picture";
import { MapGeneration } from "./view/component/MapGeneration";
import { PictureInput } from "./view/component/PictureInput";
import { TimestampIntervalInput } from "./view/component/TimestampIntervalInput";
import finishline from "./view/background.jpg";

export class makecanvas {
		private options: HTMLElement = document.getElementById("container-options");
    		private configurations: HTMLElement = document.getElementById("container-configurations");
    		private controls: HTMLElement = document.getElementById("animation-controls");
		    private filename: HTMLElement = document.getElementById("file-name");
		    private canvas: HTMLElement ;

		    private title: HTMLElement = document.getElementById("title");
		    private configurationsPanel: HTMLElement = document.getElementById("panel-configurations");

		    public canvasView: Canvas ;
		    public videocanvas: Canvas;
		    private animationControlsView:AnimationControls;


		    private fileInput: HTMLElement = document.getElementById("file-input");
		    private fileInput2: HTMLElement = document.getElementById("file-input");

		    private dataset: DataSet = DataSet.createDataSet();
		    
			public canvasname;
		  

		    private exporter: DataExporter = new DataExporter();
		    public styler: ConfigurationStyler;
		   public renderer: Renderer;
		   public fitter: DataFitter;
		    public animation: DataAnimation;
		    public animator: DataAnimator;
		

		    public datagrid: DataGrid;

 public constructor(dataset:DataSet, renderer:Renderer, animationControls:AnimationControls, styler:ConfigurationStyler, canvasname:any,races:any) {
 	this.dataset=dataset;
 	this.renderer=renderer;
 	this.canvas= document.getElementById("canvas"+<string>canvasname);
 	this.canvasView = new Canvas();
 	
 	
 	this.animationControlsView=animationControls;
        this.renderer = new Renderer(this.canvasView.content, "2d");
        this.styler=styler
        console.log(this.canvasView.content)
        this.fitter = new DataFitter(this.dataset, this.renderer);
        this.datagrid = new DataGrid(this.fitter);
        this.canvasname=canvasname
        this.animation = new DataAnimation(this.dataset,
            this.fitter, this.styler,this.canvasname, races);
        this.animator = new DataAnimator(this.dataset,
            this.animationControlsView, this.animation, this.renderer);
    }
 }

