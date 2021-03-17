import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Timer, TimerState } from 'jts-timer' ;
import { GeoPoint } from '../GeoProvider/geoPoint';
import { GeoUtils } from '../GeoProvider/geoUtils';
import { Geolocator } from '../GeoProvider/geolocator';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { GeoTrack } from '../GeoProvider/geoTrack';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit{
  currentPoint: GeoPoint;
  oldPoint: GeoPoint;

  totalDistance: any = 0;
  lastDistance: any = 0;

  timer: Timer = new Timer();
  message: string = "no message";

  isRunning: Boolean = false;

  watcher: Subscription = null;

  track: GeoTrack;
  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor( private geolocator: Geolocator, private storage: Storage ){}

  getFromStorage(){
    this.storage.get('tracks').then((res) => {
      let mm = (res == null) ? new Array<GeoTrack>(): res;
      mm.map(track => this.tracks.push(new GeoTrack(track._name, track._date, track._points)));
    }).catch((err)=> {
      this.message = err;
    });
  }

  ngAfterViewInit(): void {
    this.getFromStorage();
  }

  initValues(){
    this.track = new GeoTrack();
    this.message = "no message";
    this.oldPoint = this.currentPoint = null;
    this.totalDistance = 0;
    if (this.timer != null && this.timer.state != TimerState.Run){ 
      this.timer.stop(); 
      this.isRunning = false;
    }
    this.timer = new Timer();
  }

  watchCurrentCoordinates(){
    this.message = "Wait for GPS";
    this.watcher = this.geolocator.watchPosition().subscribe(
      (res) => {
        if (res.accuracy > 5 ){ return; }

        this.oldPoint = this.currentPoint;
        this.currentPoint = res; 
        this.message = "Running";
        if (this.oldPoint == null ) { this.track.points.push(this.currentPoint); return; }
        this.totalDistance = this.totalDistance + GeoUtils.getDistance(this.oldPoint, this.currentPoint);

        //store
         if (
          (this.currentPoint.getLatitude(5) != this.oldPoint.getLatitude(5)) || 
          (this.currentPoint.getLongitude(5) != this.oldPoint.getLongitude(5))){
            this.track.points.push(this.oldPoint);
        }
      },
      (error) => {
        this.message = error.message;
      }
    );
  }

  traceLocation() {
    this.initValues();
    this.watchCurrentCoordinates();
    this.isRunning = true;
    this.timer.start();
  }

  stopLocation() {
    this.isRunning = false;
    this.timer.stop();
    this.watcher.unsubscribe(); 
    // store
    this.tracks.push(this.track);
    console.log(this.tracks);
    // ???? must be then and catch
    this.storage.set('tracks', this.tracks);
  }

  clearStorage(){
    this.storage.clear();
    this.tracks = new Array<GeoTrack>();
  }
}
