
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
import {makecanvas} from "./makecanvas"
export class App {
    private options: HTMLElement = document.getElementById("container-options");
    private configurations: HTMLElement = document.getElementById("container-configurations");
    private controls: HTMLElement = document.getElementById("animation-controls");
    private filename: HTMLElement = document.getElementById("file-name");
    private canvas: HTMLElement = document.getElementById("animation-canvas");
    private title: HTMLElement = document.getElementById("title");
    private configurationsPanel: HTMLElement = document.getElementById("panel-configurations");

    private canvasView: Canvas;
    private canvasView2: Canvas;
    private animationControlsView: AnimationControls = new AnimationControls();

    private fileInput: HTMLElement = document.getElementById("file-input");
    private fileInput2: HTMLElement = document.getElementById("file-input");

    private dataset: DataSet = DataSet.createDataSet();
    private dataset2: DataSet = DataSet.createDataSet();

    private loader: DataLoader = new DataLoader();
    private loader2: DataLoader = new DataLoader();
    private exporter: DataExporter = new DataExporter();
    private styler: ConfigurationStyler;
    private renderer: Renderer;
    private renderer2: Renderer;
    private fitter: DataFitter;
    private newcanvas: makecanvas;
    private newcanvas2: makecanvas;
    private animation: DataAnimation;
    private animation2: DataAnimation;
    private animator: DataAnimator;
    private tasks
    private datagrid: DataGrid;
     public races= Array();
	private canvasviews=[]
    public constructor() {
    	this.styler = new ConfigurationStyler(this.dataset,
            this.configurations, this.races);
       this.newcanvas=new makecanvas(this.dataset,this.renderer, this.animationControlsView, this.styler,0,this.races)
       this.newcanvas2=new makecanvas(this.dataset,this.renderer, this.animationControlsView, this.styler,1,this.races)
     
       this.renderer= this.newcanvas.renderer
       this.fitter= this.newcanvas.fitter
      
       this.canvasviews.push(this.newcanvas)
       this.canvasviews.push(this.newcanvas2)
       
       this.animator= this.newcanvas.animator
       this.animation=this.newcanvas.animation
       this.animation2=this.newcanvas2.animation
       this.styler=this.newcanvas.styler
       this.datagrid= this.newcanvas.datagrid;
    }

    public start(): void {
        this.setupFileInput();
        

        this.setupOptions();
        this.setupControls();
        this.setupCanvas();
        this.setupFileInput2();
        
    }

    private setupCanvas() {
    	
        
        for(var k of this.canvasviews){
        	
        	window.addEventListener("resize", () => k.renderer.render());
        	k.canvas.appendChild(k.canvasView.content)
         	
        
        	k.renderer.enqueue(k.datagrid, -2);
        	window.dispatchEvent(new Event('resize'));
        	k.fitter.interaction.active = true;
    }
}
    private setupControls() {
        this.controls.appendChild(this.animationControlsView.content);
    }
   
    private setupFileInput() {
        this.fileInput.addEventListener("change", () => {
            const file = (this.fileInput as HTMLInputElement).files;
            var k=0
            let datapunten=undefined
            let teller=0
            this.tasks=file.length
            
            
            	   
		    this.loader.load2(datapunten,file, (datapoints) => {
		        this.animator.fps = 1;
		       
		        this.dataset.timeDate = this.loader.getTimeType();
		        this.dataset.data = datapoints;
		        --this.tasks
		        
		        
		      
		    });
		    
		    this.fitter.interaction.reset();
		    
            
            
        })
    }
    public updatedataset(){
    	this.animation.update;
    	}
    private setupFileInput2(){
    	this.fileInput2.addEventListener("change", () => {
            this.updatedataset;
              
          
            
        })
        }
 
    	
    	
    private setupOptions() {
        const options = new Dropdown();
        const file = new DropdownMenu("File");
        const addfile = new DropdownSubMenu("import")
        addfile.add(
            new DropdownButton("add File", () => {
            	
            	
                this.fileInput.click();
               
            }),
          
        );
        file.add(
            addfile,
            
        );
        file.add(
            new DropdownButton("Export", () => {
                this.exporter.exportToCsv('output.csv', this.dataset.data);
            })
        );
        
        const edit = new DropdownMenu("Edit");
        const snap = new DropdownSubMenu("Snap");
        edit.add(
            
            new DropdownButton("snap", () => {
                this.dataset.apply(new Spatial_EndPoint());
            }),
            

        );
        const interpolate = new DropdownSubMenu("Interpolate");
        interpolate.add(
            new DropdownButton("Very low (one frame per hour)", () => {
                this.changefps(1/3600);
                this.dataset.apply(new Interpolator(1/3600));
            }),
            new DropdownButton("Low (one frame per minute)", () => {
                this.changefps(1/60);
                this.dataset.apply(new Interpolator(1/60));
            }),
            new DropdownButton("Medium (one frame per second)", () => {
                this.changefps(1);
                this.dataset.apply(new Interpolator(1));
            }),
            new DropdownButton("High (60 frames per second)", () => {
                this.changefps(60);
                this.dataset.apply(new Interpolator(60));
            }),
            new DropdownButton("Very high (120 frames per second)", () => {
                this.changefps(120);
                this.dataset.apply(new Interpolator(120));
            })
        )
        edit.add(
            interpolate,
            
        );
        const view = new DropdownMenu("View");
        view.add(
            new DropdownButton("Configurations", () => {
                if (this.configurationsPanel.style.display == "none")
                    this.configurationsPanel.style.display = "";
                else
                    this.configurationsPanel.style.display = "none";
                window.dispatchEvent(new Event("resize"));
            }),
            new DropdownButton("Reset canvas view", () => {
                this.fitter.interaction.reset();
                this.renderer.render();
            }),
            new DropdownButton("Toggle grid", () => {
                try {
                    this.renderer.dequeue(this.datagrid);
                } catch {
                    this.renderer.enqueue(this.datagrid, -2);
                }
                this.renderer.render();
            })
        );
        const addons = new DropdownMenu("Addons");
        addons.add(
            new DropdownButton("Add picture", () => {
                const component = new PictureInput();
              
                   
                const image = new Image();
                image.onload = () => this.renderer.render();
                    
             
                image.src = finishline;
                   
                    
                
                this.renderer.enqueue(new FixedPicture(
                image, this.fitter,
                0,
                50,
                50,
                0
                    ), -1);
                    
                })
               
        );
        const help = new DropdownMenu("Help");
        help.add(
            new DropdownButton("Wiki", () => {
                window.open("https://github.ugent.be/cartogis/spc_tool/wiki")
            })
        );
        options.add(file, edit, view, addons, help);
        this.options.appendChild(options.content);
    }
    private changefps(number:any){
    	for(var k of this.canvasviews){
        	
        	k.animator.fps=number;
    }
}
	
}	
