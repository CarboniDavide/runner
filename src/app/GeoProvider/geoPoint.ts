export class GeoPoint {
    private _latitude?: number = null;
    private _longitude?: number = null;
    private _altitude?: number = null;
    private _accuracy?: number = null;
    private _altitudeAccuracy?: number = null;
    private _speed?: number = null;
    private _heading?: number = null
    private _timestamp?: number = null;
  
    constructor(latitude=null, longitude=null, altitude=null, accuracy=null, altitudeAccuracy=null, heading=null, speed=null, timestamp=null){
      this._latitude = latitude;
      this._longitude = longitude;
      this._altitude = altitude;
      this._accuracy = accuracy;
      this._altitudeAccuracy = altitudeAccuracy;
      this._speed = speed;
      this._heading = heading;
      this._timestamp = timestamp;
    }

    public get latitude() { return this._latitude; }
    public get longitude() { return this._longitude; }
    public get altitude() { return this._altitude; }
    public get altitudeAccuracy() { return this._altitudeAccuracy; }
    public get accuracy() { return this._accuracy; }
    public get speed() { return this._speed; }
    public get heading() { return this._heading; }
    public get timestamp() { return this._timestamp; }

    public getLatitude(precision: number = 5){
      return this._latitude != null ? this._latitude.toFixed(precision) : "NaN";
    }

    public getLongitude(precision: number = 5){
      return this._longitude != null ? this._longitude.toFixed(precision) : "NaN";
    }
    
    public getAltitude(precision: number = 5){
      return this._altitude != null ? this._altitude.toFixed(precision) : "NaN";
    }

    public getSpeedToKm(precision: number = 3){
      return this._speed != null ? (this._speed * 3.6).toFixed(precision) : "NaN";
    }

    public getSpeedToM(precision: number = 3){
      return this._speed != null ? this._speed.toFixed(precision) : "NaN";
    }

    public getHeading(precision: number = 3){
      return this._heading != null ? this._heading.toFixed(precision) : "NaN";
    }
    
    public getAccuracy(precision: number = 3){
      return this._accuracy != null ? this._accuracy.toFixed(precision) : "NaN";
    }
  }