import { GeoPoint } from "./geoPoint";

export class GeoTrack {
    public name?: string;
    public timestamp?: number;
    public points?: Array<GeoPoint>;

    constructor(name:string|null=null, timestamp:number|null=null, points:Array<GeoPoint>|null=null){
        this.timestamp = (timestamp == null) ? new Date().getTime() : timestamp;
        this.name = (name == null) ? "Track_"+this.timestamp : name;
        this.points = (points == null) ? new Array<GeoPoint>() : points;
    }
}