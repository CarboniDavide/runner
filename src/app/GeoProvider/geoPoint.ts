export class GeoPoint {
    latitude?: number = null;
    longitude?: number = null;
    altitude?: number = null;
    accuracy?: number = null;
    speed?: number = null;
    heading?: number = null
    timestamp?: number = null;
  
    constructor(latitude, longitude, altitude, accuracy, heading, speed, timestamp){
      this.latitude = latitude;
      this.longitude = longitude;
      this.altitude = altitude;
      this.accuracy = accuracy;
      this.speed = speed;
      this.heading = heading;
      this.timestamp = timestamp;
    }
  }