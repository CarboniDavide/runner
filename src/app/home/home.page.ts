import { Component, OnInit } from '@angular/core';
import { Timer, TimerState } from 'jts-timer' ;
import { GeoPoint } from '../GeoProvider/geoPoint';
import { GeoUtils } from '../GeoProvider/geoUtils';
import { Geolocator } from '../GeoProvider/geolocator';
import { Observable, Subscriber, Subscription } from 'rxjs';

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

  useWatcher: Boolean = true;
  isRunning: Boolean = false;

  watcher: Subscription = null;

  constructor( private geolocator: Geolocator ){
    this.initValues();
  }

  initValues(){
    this.message = "no message";
    this.oldPoint = this.currentPoint = null;
    this.totalDistance = 0;
    if (this.timer != null && this.timer.state != TimerState.Run){ this.timer.stop(); }
    this.timer = new Timer(100);
    this.timer.onClock = () => {};
  }

  getSessionDistance(){}

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.oldPoint = this.currentPoint;
    this.geolocator.getCordinates().then((p) => {
      this.message = "running";
      this.currentPoint = p;
     }).catch((error) => {
       this.message = error.message;
     });
    this.getSessionDistance();
  }

  watchCurrentCoordinates(){
    this.watcher = this.geolocator.watchPosition().subscribe(
      (res) => { 
        this.currentPoint = res; 
      },
      (error) => {
        this.message = error.message;
      }
    );
  }

  traceLocation() {
    if (!this.useWatcher){ 
      this.timer.onClock = this.getCurrentCoordinates.bind(this); 
    } else {
      this.watchCurrentCoordinates();
    }
    this.isRunning = true;
    this.timer.start();
  }

  stopLocation() {
    this.isRunning = false;
    this.timer.stop();
    if (this.useWatcher){ 
      this.watcher.unsubscribe(); 
    }
  }

  usePromise() {
    this.initValues();
    this.useWatcher = false;
  }

  useObserver(){
    this.initValues();
    this.useWatcher = true;
  }
}
