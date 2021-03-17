import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Timer, TimerState } from 'jts-timer';
import { Subscription } from 'rxjs';
import { Geolocator } from '../GeoProvider/geolocator';
import { GeoPoint } from '../GeoProvider/geoPoint';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { GeoTrack } from '../GeoProvider/geoTrack';
import { GeoUtils } from '../GeoProvider/geoUtils';

@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage {
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

  constructor( private geolocator: Geolocator, private geoStorage: GeoStorage ){
    this.tracks = this.geoStorage.tracks;
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
        this.geolocator.lastPosition = res;
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
    this.geoStorage.isStoring = this.isRunning;
    this.timer.start();
  }

  stopLocation() {
    this.isRunning = false;
    this.geoStorage.isStoring = this.isRunning;
    this.timer.stop();
    this.watcher.unsubscribe(); 
    // store
    this.tracks.push(this.track);
    // ???? must be then and catch
    this.geoStorage.set('tracks', this.tracks);
  }
}
