import { Component } from "./Component";

export class TimestampIntervalInput implements Component {
    private _content: HTMLElement = document.createElement("div");
    private _years: HTMLInputElement = document.createElement("input");
    private _months: HTMLInputElement =document.createElement("input");     
    private _days: HTMLInputElement = document.createElement("input");
    private _hours: HTMLInputElement = document.createElement("input"); 
    private _mins: HTMLInputElement = document.createElement("input"); 
    private _seconds: HTMLInputElement = document.createElement("input");

    public constructor() {
        const width_times = "40px";

        const fileInputText = document.createElement("span");
        fileInputText.textContent = "Give in the time interval you want to snap";
        this._content.appendChild(fileInputText); 
        this._content.appendChild(document.createElement("br"));
        
        this._years.type = "number"; this._years.min="0"; this._years.style.width = width_times; this._years.value="0";
        this._months.type = "number"; this._months.min = "0"; this._months.max = "11"; this._months.style.width = width_times; this._months.value="0";
        this._days.type = "number"; this._days.min = "0"; this._days.max = "31"; this._days.style.width = width_times; this._days.value="0";
        this._hours.type = "number"; this._hours.min = "0"; this._hours.max = "23"; this._hours.style.width = width_times; this._hours.value="0";
        this._mins.type = "number"; this._mins.min = "0"; this._mins.max = "59"; this._mins.style.width = width_times; this._mins.value="0";
        this._seconds.type = "number"; this._seconds.min = "0"; this._seconds.max = "59"; this._seconds.style.width = width_times; this._seconds.value="0";

        this._content.appendChild( document.createTextNode("Years: ")); this._content.appendChild(this._years); this._content.appendChild(document.createElement("br"));
        this._content.appendChild( document.createTextNode("Months: ")); this._content.appendChild(this._months); this._content.appendChild(document.createElement("br"));
        this._content.appendChild( document.createTextNode("Days: ")); this._content.appendChild(this._days); this._content.appendChild(document.createElement("br"));
        this._content.appendChild( document.createTextNode("Hours: ")); this._content.appendChild(this._hours); this._content.appendChild(document.createElement("br"));
        this._content.appendChild( document.createTextNode("Minutes: ")); this._content.appendChild(this._mins); this._content.appendChild(document.createElement("br"));
        this._content.appendChild( document.createTextNode("Seconds: ")); this._content.appendChild(this._seconds); this._content.appendChild(document.createElement("br"));

    }
    public get content() {
        return this._content;
    }

    public get years() {
        return this._years;
    }
    public get months() {
        return this._months;
    }
    public get days() {
        return this._days;
    }
    public get hours() {
        return this._hours;
    }
    public get minutes() {
        return this._mins;
    }
    public get seconds() {
        return this._seconds;
    }

}

