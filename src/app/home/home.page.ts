import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Timer, TimerState } from 'jts-timer' ;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  accuracy: any = 0 // accuracy
  altitude: any = 0 // altitude
  totalDistance: any = 0;
  lastDistance: any = 0;
  timer: Timer;
  message: string = "no message";

  constructor( private geolocation: Geolocation ){
    this.InitValues();
  }

  InitValues(){
    this.message = "no message";
    this.latitude = 0;
    this.longitude = 0;
    this.totalDistance = 0;
    this.timer = new Timer(1000);
    this.timer.onClock = this.getCurrentCoordinates.bind(this);
  }


  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.message = "running";
      let oldLatitude = this.latitude;
      let oldLongitude = this.longitude;
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;
      this.altitude = resp.coords.altitude;
      this.lastDistance = Math.round(this.getDistanceFromLatLonInKm(this.latitude, this.longitude, oldLatitude, oldLongitude) * 1000);
      if (this.lastDistance < 100) { this.totalDistance = this.totalDistance + this.lastDistance };
     }).catch((error) => {
       this.message = error;
     });
  }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  traceLocation() {
    this.InitValues();
    this.timer.start();
  }

  stopLocation() {
    this.timer.stop();
  }
}
