import { Component, OnInit } from '@angular/core';
import { Timer, TimerState } from 'jts-timer' ;
import { GeoPoint } from '../GeoProvider/geoPoint';
import { GeoUtils } from '../GeoProvider/geoUtils';
import { Geolocator } from '../GeoProvider/geolocator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currentPoint: GeoPoint;
  oldPoint: GeoPoint;

  totalDistance: any = 0;
  lastDistance: any = 0;

  timer: Timer = null;
  message: string = "no message";

  isRunning: Boolean = false;

  watcher: Subscription = null;

  constructor( private geolocator: Geolocator ){
    this.initValues();
  }

  initValues(){
    this.message = "no message";
    this.oldPoint = this.currentPoint = null;
    this.totalDistance = 0;
    if (this.timer != null && this.timer.state != TimerState.Run){ 
      this.timer.stop(); 
      this.isRunning = false;
    }
    this.timer = new Timer();
  }

  getSessionDistance(){
    if (this.oldPoint == null){ return; }
    if (this.currentPoint.accuracy > 5 ){
      this.message = "Wait for GPS accuracy";
      return;
    }
    this.message = "Running";
    this.totalDistance = this.totalDistance + GeoUtils.getDistance(this.oldPoint, this.currentPoint);
  }

  watchCurrentCoordinates(){
    this.watcher = this.geolocator.watchPosition().subscribe(
      (res) => { 
        this.oldPoint = this.currentPoint;
        this.currentPoint = res; 
        this.getSessionDistance();
      },
      (error) => {
        this.message = error.message;
      }
    );
  }

  traceLocation() {
    this.watchCurrentCoordinates();
    this.isRunning = true;
    this.timer.start();
  }

  stopLocation() {
    this.isRunning = false;
    this.timer.stop();
    this.watcher.unsubscribe(); 
  }
}
