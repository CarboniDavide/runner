import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Timer, TimerState } from 'jts-timer' ;
import { getDistance, getPreciseDistance} from 'geolib';
import { GeolibInputCoordinates } from 'geolib/es/types';

export class GeoPoint {
  latitude?: number = null;
  longitude?: number = null;
  altitude?: number = null;
  accuracy?: number = null;
  speed?: number = null;

  constructor(latitude, longitude, altitude, accuracy, speed){
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;
    this.accuracy = accuracy;
    this.speed = speed;
  }

  public get point(): GeolibInputCoordinates { return { latitude : this.latitude, longitude: this.longitude} 
}  
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentPoint: GeoPoint;
  oldPoint: GeoPoint;
  referredPoint: GeoPoint;
  totalDistance: any = 0;
  lastDistance: any = 0;
  timer: Timer;
  message: string = "no message";

  constructor( private geolocation: Geolocation ){
    this.InitValues();
  }

  InitValues(){
    this.message = "no message";
    this.oldPoint = this.currentPoint = this.referredPoint = null;
    this.totalDistance = 0;
    this.timer = new Timer(3);
    this.timer.onClock = this.getCurrentCoordinates.bind(this);
  }

  getSessionDistance(){
    if (this.oldPoint == null) { return; }
    if (this.referredPoint == null) { this.referredPoint = this.currentPoint; }
    this.lastDistance = getDistance(this.oldPoint.point, this.currentPoint.point, 0.5);
    if (this.lastDistance > this.currentPoint.accuracy) {
      this.referredPoint = this.currentPoint;
      this.lastDistance = getDistance(this.referredPoint.point, this.currentPoint.point, 0.5);
      this.totalDistance = this.totalDistance + this.lastDistance;
    }
  }

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.oldPoint = this.currentPoint;
    this.geolocation.getCurrentPosition().then((p) => {
      this.message = "running";
      this.currentPoint = new GeoPoint(p.coords.latitude, p.coords.longitude, p.coords.altitude, p.coords.accuracy, p.coords.speed);
     }).catch((error) => {
       this.message = error;
     });
    this.getSessionDistance();
  }

  traceLocation() {
    this.InitValues();
    this.timer.start();
  }

  stopLocation() {
    this.timer.stop();
  }
}
