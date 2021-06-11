import type { DataPoint2D } from "../model/type/Data";

export class DataExporter{

public exportToCsv(filename, data:DataPoint2D[]) {
              
        var csvFile = '';
        csvFile += 'configuration,name,time,X-coordinate,Y-coordinate\n';
        
        for(let i = 0 ; i < data.length ; i++){
            csvFile += data[i].conf+","+ data[i].name +","+ data[i].time.toString() +","+ data[i].point.x.toString() +","+ data[i].point.y.toString() +"\n";
        }

        var b = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        
        var link = document.createElement("a");
        if (link.download !== undefined) {            
            var url = URL.createObjectURL(b);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
    
