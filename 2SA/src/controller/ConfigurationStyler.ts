import { ConfigurationStyleView, ConfigurationStyle,ConfigurationStyleRiders,ConfigurationAllrider } from "../view/component/ConfigurationView";

import { DataSet, DataUser } from "../model/DataSet";
import { DataStyler } from "./DataAnimation";
import { DataPoint2D } from "../model/type/Data";
import { Renderable, Renderer } from "../view/render/Renderer";
import { Circle, FilledRenderable } from "../view/render/Shape";
import { Point2D } from "../model/type/Point";

type option = {
    color: {
        r: number,
        g: number,
        b: number,
        a: number,
    },
    radius: number
}

export class ConfigurationStyler extends DataUser implements DataStyler {
    public confs: Map<string, option> = new Map();
    private container: HTMLElement;
    public init=0;
    private races:any;
    
    public constructor(dataset: DataSet,container: HTMLElement,races:any ) {
        super(dataset);
        this.races=races;
        this.container = container;
    }
	
    private optionColorToString(option: option) {
        return "rgba(" + option.color.r + "," + option.color.g + "," + option.color.b + "," + option.color.a + ")";
    } 

    // copied from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    private componentToHex(c: number): string {
        var hex = c.toString(16);
        return (hex.length == 1) ? "0" + hex : hex;
    }

    style(datapoint: DataPoint2D, coords: Point2D): Renderable {
        const option = this.confs.get(datapoint.conf);
        return new FilledRenderable(new Circle(coords, option.radius), this.optionColorToString(option))
    }
	
    public initialize() {
    
var setup=1
let arrayofriders=[]
    	console.log("updateconfiguration")
        const data = this.dataset.data;
        // remove current views
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        var aantalrenners=20;
        let i
        let rider
        var points
        var riders=[];
        riders.push("None")
         let allrider= new ConfigurationAllrider;
        allrider.name.textContent= "all"
        allrider.allrider.addEventListener("change",() => {
       
        	if (allrider.allrider.checked){
        			for(i=1; i<=aantalrenners;i++){
        				riders[i].rider.checked=true;
                			arrayofriders.push(""+i+"")
                		
                		}
                		}
                else{
                		for(i=1;i<=aantalrenners;i++){
                			
                		var index= arrayofriders.indexOf(""+i+"")
                		riders[i].rider.checked=false;
                		if( index!== -1){
                		arrayofriders.splice(index,1);
                		}
                		}
                		}
                		console.log(arrayofriders);
                		this.update_dataset(arrayofriders)
        	});
        	
       this.container.appendChild(allrider.content);
           for ( i=1; i<= aantalrenners;i++){
        	let rider
        
       rider=new ConfigurationStyleRiders(i);
      	rider.rider.name=""+i+""
        rider.name.textContent=""+i+"";
       arrayofriders.push(rider.rider.name)
       
        
        rider.rider.addEventListener("change",() => {
        console.log(rider.rider.name)
       
        	if (rider.rider.checked){
                		arrayofriders.push(rider.rider.name)
                		console.log("added")
                		}
                else{
                		var index= arrayofriders.indexOf(rider.rider.name)
                		
                		if( index!== -1){
                		arrayofriders.splice(index,1);
                		}
                		}
                		console.log(arrayofriders);
                		this.update_dataset(arrayofriders)
        	});
        console.log()	
        this.container.appendChild(rider.content);
        riders.push(rider)
        }
        console.log(riders)
        i=0
       
       
     	console.log(allrider.allrider)
        let settings = new ConfigurationStyle();
        settings.name.textContent="points";
        settings.points.addEventListener("change",() => {
        	
        	this.update_dataset_points(settings.points.value);
        });
        this.container.appendChild(settings.content)
        // look for new configurations or configurations that ar no longer in use
        const current = this.dataset.info.confs;
        current.forEach((value) => {
            // random colors, colissions are possible -> future button to chose?
            if (!this.confs.has(value)) this.confs.set(value, {color: {r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255), a: 1}, radius: 5})
        });
        // remove options of removed configurations and add views
       let array=[]
       console.log(this.confs)
        this.confs.forEach((value, key) => {
        	console.log("keys")
        	console.log(key)
            if (!current.has(key)) this.confs.delete(key);
            else {
            	if (!array.includes(key.split(".")[0])){
            	
                let view = new ConfigurationStyleView(key.split(".")[0]);
                
              
                view.name.textContent = key.split(".")[0];
                
               
                view.racePicker.addEventListener("change", () => {
                	console.log(view.racePicker);
                	if (view.racePicker.checked){
                		this.races.push(view.racePicker.name)
                		}
                	else{
                		var index= this.races.indexOf(view.racePicker.name)
                		if( index!== -1){
                		this.races.splice(index,1);
                		}
                		}
                	
                    
                    console.log(this.races)
                });
                
                this.container.appendChild(view.content);
                array.push(key.split(".")[0])
                console.log(this.races)
                }
               
                
                
            }
        });
        
    }
  update(): void {
         if (this.init==0){
         	this.init=1;
         	this.initialize();
            }
        
    }
private update_dataset_points(points:any){
	console.log(this.dataset.data)
	var teller=0
	var confs= new Set()
	console.log(this.dataset)
	
	this.dataset.info.confs.forEach((value,key)=>{
		confs.add(key.split(".")[0]);
	});
	console.log("makeconsfs")
	console.log(confs)
	confs.forEach((value, key) => {
	var lasttime=-1
		console.log(key)
		var punten=points
		console.log(points)
		console.log(key)
		
		console.log(this.dataset.data.length - 1)
		for (var i = this.dataset.data.length - 1; i >= 0; i--) {
			
			var time= this.dataset.data[i].time
			console.log(this.dataset.data[i].conf.split(".")[0])
			if (key==this.dataset.data[i].conf.split(".")[0] && punten>0){
				this.dataset.data[i].visible_points=true;
				console.log(i)
				
				}
			else if(key==this.dataset.data[i].conf.split(".")[0]){
				this.dataset.data[i].visible_points=false;
				}
			if (time != lasttime && key==this.dataset.data[i].conf.split(".")[0]){
				lasttime=time;
				punten=punten-1;
				}
			
		}	
		});
	
	var fps=1/(this.dataset.data[1].time-this.dataset.data[0].time)
	console.log(this.dataset.data)
	this.dataset.notifyUsers();
		
		
	
	

}
private update_dataset(arrayofriders:any){
	
	for (var k of this.dataset.data){
		
		var index=arrayofriders.indexOf(k.name)
		
		if (index==-1){
		
		k.visible=false;
		}
		else{
		k.visible=true;
		}
	}
	console.log(this.dataset)
	
	this.dataset.notifyUsers();
}
}

