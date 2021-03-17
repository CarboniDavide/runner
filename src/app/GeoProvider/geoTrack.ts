import { GeoPoint } from "./geoPoint";

export class GeoTrack {
    private _name?: string;
    private _date?: number;
    private _points?: Array<GeoPoint>;
    
    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get date(): number { return this._date; }
    public set date(value: number) { this._date = value; }
    
    public get points(): Array<GeoPoint> { return this._points; }
    public set points(value: Array<GeoPoint>) { this._points = value; }

    constructor(name:string|null=null, date:number|null=null, points:Array<GeoPoint>|null=null){
        this._date = (date == null) ? new Date().getTime() : date;
        this._name = (name == null) ? "Track_"+this._date : name;
        this._points = (points == null) ? new Array<GeoPoint>() : points;
    }
}