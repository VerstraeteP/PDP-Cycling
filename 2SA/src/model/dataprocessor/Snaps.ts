import type { DataPoint2D } from "../type/Data";
import type { Point2D } from "../type/Point";
import type { DataFitter } from "../../controller/DataFitter";
import type { DataProcessor, DataInfo } from "../DataSet";

export class Spatial_StartPoint implements DataProcessor{

    process(info: DataInfo): void {
        /* alternative
        const firstPoint: Map<string, Point2D> = new Map();
        for (let i = 0; i < info.data.length; i++) {
            const name = info.data[i].name + info.data[i].conf;
            if (!firstPoint.has(name))
                firstPoint.set(name, JSON.parse(JSON.stringify(info.data[i].point)));
            const first: Point2D = firstPoint.get(name);
            info.data[i].point.x -= first.x;
            info.data[i].point.y -= first.y;
        }
        */
        const data = info.data;
        
        //set the Map with new coördinates back in the data
        let new_data: Array<DataPoint2D> = [];

        //for every object: calculate relative distance to new central startpoint
        let central_point_x = 0;
        let central_point_y = 0;

        let objects= new Map<String,Array<DataPoint2D>>(); 
        for(var index in data){
            let naam = data[index].name;
            let config = data[index].conf;
            let key : string = naam.concat(" ",config);

            if(objects.has(key)){
                let value: Array<DataPoint2D> = objects.get(key);
                value.push(data[index]);
                objects.set(key,value);
            }
            else{
                let value : Array<DataPoint2D> = [data[index]];
                objects.set(key,value);
            }

        }

        for (let [key, datapoints] of objects) {
            //search for first timestamp of object
            let min = datapoints[0].time ;
            let min_object = datapoints[0];
            for(var index in datapoints){
                if (datapoints[index].time<min){
                    min =datapoints[index].time
                    min_object = datapoints[index];
                }
            }

            let relative_x: number = central_point_x-min_object.point.x;
            let relative_y: number = central_point_y-min_object.point.y;

            //for every timestamp: adjust coördinates to relatives to central point
            for(var index in datapoints){
                datapoints[index].point.x = Number(datapoints[index].point.x) + Number (relative_x);
                datapoints[index].point.y = Number(datapoints[index].point.y) + Number (relative_y);
            }

            //push these datapoints to a list of new data
            new_data.concat(datapoints);
        }
    }
}

export class Spatial_EndPoint implements DataProcessor{

    process(info: DataInfo): void {
        /* alternative
        const firstPoint: Map<string, Point2D> = new Map();
        for (let i = info.data.length - 1; i > -1; i--) {
            const name = info.data[i].name + info.data[i].conf;
            if (!firstPoint.has(name))
                firstPoint.set(name, JSON.parse(JSON.stringify(info.data[i].point)));
            const first: Point2D = firstPoint.get(name);
            info.data[i].point.x -= first.x;
            info.data[i].point.y -= first.y;
        }
        */
        const data = info.data;
        var races= new Array()
	info.confs.forEach((value, key) => {
		var index=races.indexOf(key.split(".")[0])
		if (index==-1){
		
		races.push(key.split(".")[0])
		}
	
	})
	var maxvalue= new Array(races.length);
	var maxtime= new Array(races.length);
	console.log("data")
	console.log(races)
	for(var i=0; i< maxvalue.length;i++){
		maxvalue[i]=null
		maxtime[i]=null
	}
	for (var k of data){
		var ind=races.indexOf(k.conf.split(".")[0])
		
		if (maxvalue[ind]<k.point.y || maxvalue[ind]== null){
			
			maxvalue[ind]=k.point.y
			}
		if(maxtime[ind]<k.time || maxvalue[ind]== null){
			maxtime[ind]=k.time;
			}
		
	
	}
	console.log(maxvalue)
	console.log(maxtime)
		
	 var maxval = Math.max.apply(null,maxvalue);
	 var maxtijd = Math.max.apply(null, maxtime);
	 for(var i=0; i< maxvalue.length;i++){
		maxvalue[i]-=maxval
		maxtime[i]-=maxtijd
		maxvalue[i]*=-1
		maxtime[i]*=-1
	}
	 console.log(maxvalue)
	console.log(maxtime)
	
        //set the Map with new coördinates back in the data
        let new_data: Array<DataPoint2D> = [];

       
        for (var k of data){
		var ind=races.indexOf(k.conf.split(".")[0])
		
		k.point.y=Number(k.point.y) + Number (maxvalue[ind]);
		
		k.time=Number(k.time) + Number (maxtime[ind])
		
		
	
	}
        	
         
		
 
            new_data.concat(data);
            console.log(data);
        
        var maxvalue= new Array(races.length);
	var maxtime= new Array(races.length);
	console.log("data")
	console.log(races)
	for(var i=0; i< maxvalue.length;i++){
		maxvalue[i]=null
		maxtime[i]=null
	}
	for (var k of data){
		var ind=races.indexOf(k.conf.split(".")[0])
		
		if (maxvalue[ind]<k.point.y || maxvalue[ind]== null){
			
			maxvalue[ind]=k.point.y
			}
		if(maxtime[ind]<k.time || maxvalue[ind]== null){
			maxtime[ind]=k.time;
			}
		
	
	}
	console.log(maxvalue)
	console.log(maxtime)
    }
}

export class Temporal_StartTime implements DataProcessor{

    process(info: DataInfo): void {
        const data = info.data;
        let actions = new Map<String,number>();

        //for every object: calculate relative time difference to new starttime
        let starttime = 0;

        let objects= new Map<String,Array<DataPoint2D>>(); 
        for(var index in data){
            let naam = data[index].name;
            let config = data[index].conf;
            let key : string = naam.concat(" ",config);

            if(objects.has(key)){
                let value: Array<DataPoint2D> = objects.get(key);
                value.push(data[index]);
                objects.set(key,value);
            }
            else{
                let value : Array<DataPoint2D> = [data[index]];
                objects.set(key,value);
            }

        }

        for (let [key, datapoints] of objects) {
            //set the first timestamp of object and it's coordinates
            let min = datapoints[0].time ;
            let first_x = datapoints[0].point.x;
            let first_y = datapoints[0].point.y;
            
            //find first time that coordinates are different and it's previous time
            let previous = min;
            let current = datapoints[0].time;
            let current_x = first_x;
            let current_y = first_y;
            var i =1;
            while(current_x== first_x && current_y==first_y && i < datapoints.length){
                current_x = datapoints[i].point.x;
                current_y = datapoints[i].point.y;
                previous = current;
                current = datapoints[i].time;
                i++;
            }


            //if there is movement, we only keep the part with the movement
            if(current_x!=first_x || current_y != first_y){
                actions.set(key,1);
                let relative_time: number = starttime-previous;
                
                //for every timestamp: adjust time to relative time to start time
                for(var index in datapoints){
                    datapoints[index].time= Number(datapoints[index].time) + Number (relative_time);
                }
            }
            else{
                actions.set(key,0);
            }

        }
        
        let max_index = data.length;
        let j =0;
        while(j<max_index){
            let naam = data[j].name;
            let config = data[j].conf;
            let key : string = naam.concat(" ",config);
            if(actions.get(key) == 0){
                //point should be removed
                [data[j], data[max_index-1]] = [data[max_index-1], data[j]];
                data.pop();
                max_index = data.length;
            }
            else{
                if(data[j].time <0){
                    //point should be removed
                    [data[j], data[max_index-1]] = [data[max_index-1], data[j]];
                    data.pop();
                    max_index = data.length;
                } else{
                    j++;
                }
            }
        }

    }
}

export class Temporal_EndTime implements DataProcessor{
    constructor(){}

    process(info: DataInfo): void {
        const data = info.data;
        let actions = new Map<String,number>();

        //for every object: calculate relative time difference to new endtime
        let endtime = data[data.length-1].time;

        let objects= new Map<String,Array<DataPoint2D>>(); 
        for(var index in data){
            let naam = data[index].name;
            let config = data[index].conf;
            let key : string = naam.concat(" ",config);

            if(objects.has(key)){
                let value: Array<DataPoint2D> = objects.get(key);
                value.push(data[index]);
                objects.set(key,value);
            }
            else{
                let value : Array<DataPoint2D> = [data[index]];
                objects.set(key,value);
            }

        }

        for (let [key, datapoints] of objects) {
            //set the last timestamp of object and it's coordinates
            let max = datapoints[datapoints.length-1].time ;
            let last_x = datapoints[datapoints.length-1].point.x;
            let last_y = datapoints[datapoints.length-1].point.y;
            
            //find last time that coordinates are different and it's next time
            let next = max;
            let current = datapoints[datapoints.length-1].time;
            let current_x = last_x;
            let current_y = last_y;
            var i =datapoints.length-2;
            while(current_x== last_x && current_y==last_y && i >=0){
                current_x = datapoints[i].point.x;
                current_y = datapoints[i].point.y;
                next = current;
                current = datapoints[i].time;
                i--;
            }


            //if there is movement, we only keep the part with the movement
            if(current_x!=last_x || current_y != last_y){
                actions.set(key,1);
                let relative_time: number = endtime-next;
                //for every timestamp: adjust time to relative time to end time
                for(var index in datapoints){
                    datapoints[index].time= Number(datapoints[index].time) + Number (relative_time);
                }
            }
            else{
                actions.set(key,0);
            }

        }
        
        let max_index = data.length;
        let j =0;
        while(j<max_index){
            let naam = data[j].name;
            let config = data[j].conf;
            let key : string = naam.concat(" ",config);

            if(actions.get(key) == 0){
                //point should be removed
                [data[j], data[max_index-1]] = [data[max_index-1], data[j]];
                data.pop();
                max_index = data.length;
            }
            else{
                if(data[j].time > endtime){
                    //point should be removed
                    [data[j], data[max_index-1]] = [data[max_index-1], data[j]];
                    data.pop();
                    max_index = data.length;
                } else{
                    j++;
                }
            }
        }

    }
}

export class Moving_through_rectangle_entering implements DataProcessor{
    
    private x_min: number = null;
    private x_max: number = null;
    private y_min: number = null;
    private y_max: number = null;

    constructor(first: Point2D, second: Point2D, fitter: DataFitter) {
    	
    	console.log(first, second);
        first = fitter.inverseFit(first);
        second = fitter.inverseFit(second);
        console.log(first, second);
        if (first.x < second.x){
            this.x_min = first.x ;this.x_max = second.x;
        } else {
            this.x_min = second.x ;this.x_max = first.x;
        }
        if (first.y < second.y){
            this.y_min = first.y ;this.y_max = second.y;
        } else {
            this.y_min = second.y ;this.y_max = first.y;
        }
        console.log(this.x_min); console.log(this.x_max); console.log(this.y_min); console.log(this.y_max);

    }

    process(info: DataInfo): void {
        const data = info.data;

        //find for each object the first point inside the rectangle and put its time into the Map objects
        let objects= new Map<string,number>(); 
        let objects_max: number = 0;
        
        for(var index in data){

            if(data[index].point.x >= this.x_min && data[index].point.x <= this.x_max && data[index].point.y >= this.y_min && data[index].point.y <= this.y_max){
                let naam = data[index].name;
                let config = data[index].conf;
                let key : string = naam.concat(" ",config);

                let value : number  = data[index].time;
                if(!objects.has(key)){
                    objects.set(key,value);
                    if (value > objects_max){
                        objects_max = value;
                    }
                } else {
                    if(objects.get(key) > data[index].time ){
                        objects.set(key,value);
                        if (value > objects_max){
                            objects_max = value;
                        }
                    }
                }
            }            
        }
        console.log(objects);
        
                
        let i = 0;
        while (i < data.length) {
            
            let key = data[i].name.concat(" ", data[i].conf);
            if (objects.has(key)) {
                data[i].time = data[i].time + objects_max - objects.get(key);
                i++;
            }
            
            else {
                [data[i],data[data.length-1]] = [data[data.length-1],data[i]]
                data.pop();
            }
        }
    }
}

export class Moving_through_rectangle_leaving implements DataProcessor{
    
    private x_min: number = null;
    private x_max: number = null;
    private y_min: number = null;
    private y_max: number = null;

    constructor(first: Point2D, second: Point2D, fitter: DataFitter) {
        console.log(first, second);
        first = fitter.inverseFit(first);
        second = fitter.inverseFit(second);
        console.log(first, second);
        if (first.x < second.x){
            this.x_min = first.x ;this.x_max = second.x;
        } else {
            this.x_min = second.x ;this.x_max = first.x;
        }
        if (first.y < second.y){
            this.y_min = first.y ;this.y_max = second.y;
        } else {
            this.y_min = second.y ;this.y_max = first.y;
        }
        console.log(this.x_min); console.log(this.x_max); console.log(this.y_min); console.log(this.y_max);

    }

    process(info: DataInfo): void {
        const data = info.data;

        //find for each object the first point inside the rectangle and put its time into the Map objects
        let objects= new Map<string,number>(); 
        let objects_max: number = 0;
        
        for(var index in data){

            if(data[index].point.x >= this.x_min && data[index].point.x <= this.x_max && data[index].point.y >= this.y_min && data[index].point.y <= this.y_max){
                let naam = data[index].name;
                let config = data[index].conf;
                let key : string = naam.concat(" ",config);

                let value : number  = data[index].time;
                if(!objects.has(key)){
                    objects.set(key,value);
                    if (value > objects_max){
                        objects_max = value;
                    }
                } else {
                    if(objects.get(key) < data[index].time ){
                        objects.set(key,value);
                        if (value > objects_max){
                            objects_max = value;
                        }
                    }
                }
            }            
        }
        console.log(objects);
            
        let i = 0;
        while (i < data.length) {
            
            let key = data[i].name.concat(" ", data[i].conf);
            if (objects.has(key)) {
                data[i].time = data[i].time + objects_max - objects.get(key);
                i++;
            }
            
            else {
                [data[i],data[data.length-1]] = [data[data.length-1],data[i]]
                data.pop();
            }
        }
        
    }
}

export class Temporal_Interval implements DataProcessor{
    private interval: number;
    constructor(interval: number){
        this.interval = interval;
    }

    process(info: DataInfo): void{
        const data = info.data;
        for(var index in data){
            data[index].time = data[index].time%this.interval;
        }
    }
}

export class Spatial_Point_Of_View implements DataProcessor{
    private naam: string = null;
    private config: string = null;

    constructor(naam: string, config:string){
        this.naam = naam;
        this.config = config;
    }

    process(info: DataInfo): void{

        const data = info.data;

        let objects : Map<number,Point2D>= new Map<number,Point2D>(); 
        let numbers : Array<number> = new Array<number>();

        for(var index in data){
            if(data[index].name == this.naam && data[index].conf == this.config){
                
                objects.set(data[index].time, data[index].point);
                numbers.push(data[index].time);
            }
        }
       
        let i = 0;
        console.log(numbers);
        
        while (i < data.length){
            let time = null;
            for(let j = 0; j<numbers.length;j++){
                if(Math.abs(data[i].time-numbers[j]) < 0.000001 ){
                    time = numbers[j];
                }
            }
            if(objects.has(time) ){
                if(!(data[i].name == this.naam && data[i].conf == this.config)){
                    data[i].point.x = data[i].point.x - objects.get(time).x;
                    data[i].point.y = data[i].point.y - objects.get(time).y;
                }
                i++;
            }
            else {
                [data[i],data[data.length-1]] = [data[data.length-1],data[i]]
                data.pop();
            }
        }

        // Now set selected datapoint to 0,0 because it's not moving when compared to itself
        i = 0;
        while (i < data.length){
            if(objects.has(data[i].time) ){
                if((data[i].name == this.naam && data[i].conf == this.config)){
                    data[i].point.x = 0;
                    data[i].point.y = 0;
                }                
            }
            i++;
            
        }

        
    }
}
