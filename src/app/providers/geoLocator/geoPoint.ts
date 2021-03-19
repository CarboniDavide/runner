export class GeoPoint {
    public latitude?: number = null;
    public longitude?: number = null;
    public altitude?: number = null;
    public accuracy?: number = null;
    public altitudeAccuracy?: number = null;
    public speed?: number = null;
    public heading?: number = null
    public timestamp?: number = null;
  
    constructor(latitude=null, longitude=null, altitude=null, accuracy=null, altitudeAccuracy=null, heading=null, speed=null, timestamp=null){
      this.latitude = latitude;
      this.longitude = longitude;
      this.altitude = altitude;
      this.accuracy = accuracy;
      this.altitudeAccuracy = altitudeAccuracy;
      this.speed = speed;
      this.heading = heading;
      this.timestamp = timestamp;
    }

    public getLatitude(precision: number = 5){
      return this.latitude != null ? this.latitude.toFixed(precision) : "NaN";
    }

    public getLongitude(precision: number = 5){
      return this.longitude != null ? this.longitude.toFixed(precision) : "NaN";
    }
    
    public getAltitude(precision: number = 5){
      return this.altitude != null ? this.altitude.toFixed(precision) : "NaN";
    }

    public getSpeedToKm(precision: number = 3){
      return this.speed != null ? (this.speed * 3.6).toFixed(precision) : "NaN";
    }

    public getSpeedToM(precision: number = 3){
      return this.speed != null ? this.speed.toFixed(precision) : "NaN";
    }

    public getHeading(precision: number = 3){
      return this.heading != null ? this.heading.toFixed(precision) : "NaN";
    }
    
    public getAccuracy(precision: number = 3){
      return this.accuracy != null ? this.accuracy.toFixed(precision) : "NaN";
    }
  }