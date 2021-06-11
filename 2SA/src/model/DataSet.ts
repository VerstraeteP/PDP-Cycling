import type { DataPoint2D } from "./type/Data"

export interface DataProcessor {
    process(info: DataInfo): void;
}

export abstract class DataUser {
    protected dataset: DataSet;
    
    constructor(dataset: DataSet) {
        this.dataset = dataset;
        
        dataset.registerUser(this);
    }
    abstract update(): void;
   
}

export class DataInfo extends DataUser {
    private _max: number[];
    private _min: number[];
    public _confs: Set<string>;
    private _times: Array<number>;
    private _objects: Map<string, Array<DataPoint2D>>;
    private _names: Set<string>;
    public get data(): DataPoint2D[] {
        return this.dataset.data;
    }

    public get max(): number[] {
        return this._max;
    }

    public get min(): number[] {
        return this._min;
    }
    public get names(): Set<string>{
    	return this._names;
    	}

    public get confs(): Set<string> {
        return this._confs;
    }

    public get objects(): Map<string, Array<DataPoint2D>> {
        return this._objects;
    }

    public get times(): Array<number> {
        return this._times;
    }

    update() {
        this._objects = new Map();
        this._confs = new Set();
        this._min = [this.data[0].point.x, this.data[0].point.y];
        this._max = [this.data[0].point.x, this.data[0].point.y];
        this._times = [this.data[0].time];
        this._names= new Set()
        
        let j = 0;
        for (let i = 0; i < this.data.length; i++) {
            // determine maximum x, y
            if (this.data[i].point.x > this._max[0]) {
                this._max[0] = this.data[i].point.x;
            }
            if (this.data[i].point.y > this._max[1]) {
                this._max[1] = this.data[i].point.y;
            }
            // determine minimum x, y
            if (this.data[i].point.x < this._min[0]) {
                this._min[0] = this.data[i].point.x;
            }
            if (this.data[i].point.y < this._min[1]) {
                this._min[1] = this.data[i].point.y;
            }
            // list all configurations
            if (!this._confs.has(this.data[i].conf)) {
                this._confs.add(this.data[i].conf);
            }
            // list all times
            if (Math.abs(this.data[i].time - this._times[j]) > 1E-10) {
                this._times.push(this.data[i].time);
            }
            // group datapoints per object
            if (!this._objects.has(this.data[i].name + "@" + this.data[i].conf))
                this._objects.set(this.data[i].name + "@" + this.data[i].conf, []);
            this._objects.get(this.data[i].name + "@" + this.data[i].conf).push(this.data[i]);
        }
        for( var k in this._confs){
        	this._names.add(k)
        	}
        console.log(this._names)
        console.log(this.data);
    }

}

export class DataSet {
    // data is always sorted by time
    private _data: DataPoint2D[] = [];
    private _users: DataUser[] = [];
    public _info: DataInfo;
    
    private _timeDate: boolean = false;

    private constructor() {};

    // factory method to initialize DataInfo with DataManager
    public static createDataSet(): DataSet {
        const dataset = new DataSet();
        dataset._info = new DataInfo(dataset);
        dataset.registerUser(dataset._info);
        return dataset;
    }

    public get data(): DataPoint2D[] {
        return this._data;
    }

    public get users(): DataUser[] {
        return this._users;
    }

    public get info(): DataInfo {
        return this._info;
    }

    public set data(data: Array<DataPoint2D>) {
        // deep copy
        this._data = JSON.parse(JSON.stringify(data));
        this.changed();
    }

    public get timeDate() {
        return this._timeDate;
    }

    public set timeDate(timeDate: boolean) {
        this._timeDate = timeDate;
    }

    public registerUser(user: DataUser): void {
        this._users.push(user);
    }

    public notifyUsers(): void {
    	console.log("nofityusers")
        for (let i = 0; i < this.users.length; i++)
            this._users[i].update();
    }

    public apply(processor: DataProcessor) {
        console.log("DATASET: data processing by " + processor.constructor.name);
        processor.process(this.info);
        this.changed();
        console.log("DATASET: done data processing by " + processor.constructor.name);
    }

    private changed() {
        this.data.sort((a, b) => (a.time < b.time) ? -1 : (a.time === b.time) ? 0 : 1);
        this.notifyUsers();
        
    }

}
