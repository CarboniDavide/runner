import { GeoPoint } from "./geoPoint";
import { GeoUtils } from "./geoUtils";

export class GeoTrack {
    public name?: string;
    public startAt?: number;
    public endAt?: number;
    public points?: Array<GeoPoint>;

    constructor(name:string|null=null, startAt:number|null=null, endAt:number|null=null, points:Array<GeoPoint>|null=null){
        this.startAt = (startAt == null) ? new Date().getTime() : startAt;
        this.endAt = endAt;
        this.name = (name == null) ? "track_"+this.startAt : name;
        this.points = (points == null) ? new Array<GeoPoint>() : points;
    }

    public get distance(): number{

        let d: number = 0;
        let prec: GeoPoint = null;

        this.points.forEach(
            (point, index) => {
                d = d + this.getABDistance(prec, point);
                prec = point;
            }
        );

        return d;
    }

    public getABDistance(pointA: GeoPoint=null, pointB: GeoPoint=null) {
        if ((pointA == null ) || (pointB == null)) { return 0; }
        let R = 6371; // Radius of the earth in km
        let dLat = this._deg2rad(pointB.latitude-pointA.latitude);  // deg2rad below
        let dLon = this._deg2rad(pointB.longitude-pointA.longitude); 
        let a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this._deg2rad(pointA.latitude)) * Math.cos(this._deg2rad(pointB.latitude)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        let d = R * c; // Distance in km
        return d;
      }
      
    private _deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    public getCenter(){
        
    }
}