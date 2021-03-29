import { Component } from '@angular/core';
import { Exchanger } from '../providers/exchanger';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';

@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage {

  isRunning: boolean = false;

  constructor( private geoStorage: GeoStorage, public geoWatcher: GeoWatcher){}

  traceLocation() {
    this.geoWatcher.start();
    this.isRunning = true;
  }

  stopLocation() {
    this.isRunning=false;
    this.geoWatcher.stop();
    this.geoStorage.addTrack(this.geoWatcher.track);
  }

  pauseLocation() {
    this.isRunning=false;
    this.geoWatcher.suspend ();
  }

  onFullCircle(){
    this.stopLocation();
  }
}
