import type { DataProcessor, DataInfo } from "../DataSet";

export class Interpolator implements DataProcessor {
    private fps: number = 0;

    public constructor(fps: number) {
        this.fps = fps;
    }

    public process(info: DataInfo) {
        const delta = 1 / this.fps;
        const interpolated = [];
        info.objects.forEach((value) => {
            // init
            const firstTime = Math.ceil(value[0].time / delta) * delta;
            let i = 1;
            if (value[i] == null)
                throw new Error("Cannot interpolate object with only one datapoint");
            // interpolate
           var teller=0
            for (let t = firstTime; t <= value[value.length - 1].time; t += delta) {
             console.log(value[i])
             
                while (t > value[i].time) i++;
                interpolated.push({
                    point: {
                        x: (value[i].point.x - value[i - 1].point.x) / (value[i].time - value[i - 1].time) * (t - value[i].time) + value[i].point.x,
                        y: (value[i].point.y - value[i - 1].point.y) / (value[i].time - value[i - 1].time) * (t - value[i].time) + value[i].point.y
                    },
                    time: t,
                    name: value[0].name,
                    visible: value[0].visible,
                    visible_points: value[teller].visible_points,
                    conf: value[0].conf
                });
                teller+=1;
            }
        });
        // replace data by interpolated data
        info.data.splice(0);
        for (let i = 0; i < interpolated.length; i++) {
            info.data.push(interpolated[i]);
        }
        console.log(info.data);
    }
}
