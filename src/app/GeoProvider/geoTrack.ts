import { GeoPoint } from "./geoPoint";

export class GeoTrack {
    public name?: string;
    public startAt?: number;
    public endAt?: number;
    public points?: Array<GeoPoint>;

    constructor(name:string|null=null, timestamp:number|null=null, points:Array<GeoPoint>|null=null){
        this.startAt = (timestamp == null) ? new Date().getTime() : timestamp;
        this.name = (name == null) ? "track_"+this.startAt : name;
        this.points = (points == null) ? new Array<GeoPoint>() : points;
    }
}