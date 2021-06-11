import { parse, ParseResult } from "papaparse"
import type { DataPoint2D } from "../model/type/Data";

export class DataLoader {
    public callback: (datapoints: Array<DataPoint2D>) => void;
    private index: Object;
    private TimeType: boolean; // 1 is timestamp and 0 is number
    public dataarray: Array<any>;
public tasks:any;
public dataprev:any;
    public getTimeType(){
        return this.TimeType;
    }

    public load(file: File, callback: (datapoints: Array<DataPoint2D>) => void) {
        this.callback = callback;
        parse<unknown>(file, {
            skipEmptyLines: true,
            complete: (results) => this.process(results, file),
        });
    }
    private process(results: ParseResult<unknown>, file: any ) {
        const data = results.data;
        
        if (this.headerFieldsPresent(results.data[0])) {
            this.TimeType = isNaN(data[1][this.index["time"]]) ?  true:false;
            const datapoints = this.parseToDataPoint2D(results.data,<string>file.name.slice(0,-4));
            
            this.callback(datapoints);
            this.dataarray=datapoints;
            return;
        }
       
    }
    public load2(dataprev:any,files: any, callback: (datapoints: Array<DataPoint2D>) => void) {
        this.callback = callback;
       console.log(files)
        var len= files.length;
        var i=0;
        
        this.tasks=files.length;
        this.dataarray=[];
        for( i;i< len;i++){
        	
        	
        	const file = files[i]
        	
		parse<unknown>(file, {
		    skipEmptyLines: true,
		    complete: (results) => this.process2(results, dataprev,file),
		});
      } 
      
      return; 
    }
  
    private process2(results: ParseResult<unknown>, dataprev:any, file:any) {
        const data = results.data;
        console.log("parsingdata")
        if (this.headerFieldsPresent(results.data[0])) {
            this.TimeType = isNaN(data[1][this.index["time"]]) ?  true:false;
           console.log(file.name)
           
            var datapoints = this.parseToDataPoint2D(results.data, <string> file.name.slice(0,-4)+".");
            --this.tasks
            if (this.dataarray.length!=0){
           	 this.dataarray=this.dataarray.concat(datapoints)
             	console.log("concatenate")
            	datapoints=this.dataarray;
            	
            	}
            else{
            	
            	this.dataarray=datapoints;
            	}
            this.dataprev=this.dataarray;
            if (this.tasks==0){
            this.callback(datapoints)
            }
            
           
            
        }
        alert("File input not valid.")
    }
  

    
    private headerFieldsPresent(fields: any): boolean {
        this.index = {
            "x": null,
            "y": null,
            "time": null,
            "conf": null,
            "name": null
        };
        for (let i = 0; i < fields.length; i++) {
            for (let field in this.index) {
                let isSubstring = (fields[i].toLowerCase().search(field) != -1)
                if (field == "name") isSubstring ||= (fields[i].toLowerCase().search("id") != -1);
                if (isSubstring) {
                    this.index[field] = i;
                    break;
                }
            }
        }
        // configuration name is optional (not included for proposition)
        return (this.index["x"] != null) && (this.index["y"] != null) && (this.index["time"] != null) && (this.index["name"] != null) ;
    }

    private parseToDataPoint2D(data: Array<unknown>, file:string): Array<DataPoint2D> {
        const timeParse = isNaN(data[1][this.index["time"]]) ? ((row) => (new Date(row[this.index["time"]])).getTime() / 1000) : ((row) => Number(row[this.index["time"]]));
        const confParse = (data[1][this.index["conf"]] == null) ? (row) => row[this.index["name"]] : (row) => row[this.index["conf"]];
        var datapoints: Array<DataPoint2D> = [];
        
        for (let i = 1; i < data.length; i++) {
            datapoints.push({
                point: {
                    x: Number(data[i][this.index["x"]]),
                    y: Number(data[i][this.index["y"]])
                },
                time: timeParse(data[i]),
                name: data[i][this.index["name"]],
               visible: true,
               visible_points:false,
                conf: file+confParse(data[i])
            })
        }
        return datapoints;
    }
}
