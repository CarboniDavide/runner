import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Timer, TimerState } from 'jts-timer';
import { Subscription } from 'rxjs';
import { Geolocator } from '../GeoProvider/geolocator';
import { GeoPoint } from '../GeoProvider/geoPoint';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { GeoTrack } from '../GeoProvider/geoTrack';
import { GeoUtils } from '../GeoProvider/geoUtils';
import { GeoWatcher, GeoWatcherSate } from '../GeoProvider/geoWatcher';

@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage {

  isRunning: boolean = false;

  constructor( private geoStorage: GeoStorage, public geoWatcher: GeoWatcher ){}

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
    this.geoWatcher.suspend();
  }
}
