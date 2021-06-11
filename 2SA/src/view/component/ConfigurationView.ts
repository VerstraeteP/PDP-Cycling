import { Component } from "./Component";

export class ConfigurationStyleView implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _name: HTMLSpanElement = document.createElement("span");
    private _racePicker: HTMLInputElement = document.createElement("input");
    private _racename: string
   	
    
    public constructor(_racename:string) {
    	
    	
    	
        const top = document.createElement("div");
        this._racePicker.type = "checkbox";
        this._racePicker.name= _racename
        top.append(this._name, this._racePicker)
        this._content.classList.add("card-configuration");
        this._content.append(top)
        this._racePicker.checked=false
    }
    public get content(): HTMLElement {
        return this._content;
    }
    public get name(): HTMLSpanElement {
        return this._name;
    }
    public get racePicker(): HTMLInputElement {
        return this._racePicker;
    }
   
   f
   	
}

export class ConfigurationStyle implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _name: HTMLSpanElement = document.createElement("span");
    
    private _points: HTMLInputElement = document.createElement("input");
    
    public constructor() {
    	const settings= document.createElement("div")
    	this._points.type= "number"
    	settings.append(this._name,this._points)
    	
       
        this._content.classList.add("card-configuration");
        
        this._content.append(settings)
    }
    public get content(): HTMLElement {
        return this._content;
    }
    public get name(): HTMLSpanElement {
        return this._name;
    }
    public get points(): HTMLInputElement {
        return this._points;
    }
  
}
export class ConfigurationStyleRiders implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _name: HTMLSpanElement = document.createElement("div");
    private _rider: HTMLInputElement = document.createElement("input");
   private _rennername: string;
   
    
    public constructor(_rennername:any) {
    	const settings= document.createElement("div")
    	this._rider.type= "checkbox"
    	settings.append(this._name,this._rider)
    	this._rider.name=_rennername;
       
        this._content.classList.add("card-configuration");
        this._rider.checked=true
        this._content.append(settings)
    }
    public get content(): HTMLElement {
        return this._content;
    }
    public get name(): HTMLSpanElement {
        return this._name;
    }
    public get rider(): HTMLInputElement {
        return this._rider;
    }
  
}


export class ConfigurationAllrider implements Component {
    private _content: HTMLElement = document.createElement("span");
    private _name: HTMLSpanElement = document.createElement("span");
    private _allrider: HTMLInputElement = document.createElement("input");
   
   
    
    public constructor() {
    	const settings= document.createElement("div")
    	this._allrider.type= "checkbox"
    	settings.append(this._name,this._allrider)
    
       
        this._content.classList.add("card-configuration");
        this._allrider.checked=true
        this._content.append(settings)
    }
    public get content(): HTMLElement {
        return this._content;
    }
    public get name(): HTMLSpanElement {
        return this._name;
    }
    public get allrider(): HTMLInputElement {
        return this._allrider;
    }
  
}
