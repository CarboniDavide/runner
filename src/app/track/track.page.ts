import { AfterContentInit, Component, ElementRef } from '@angular/core';
import { ActivityWatcher, ActivityWatcherSate } from '../providers/geoLocator/activityWatcher';
import { GeoLocator } from '../providers/geoLocator/geoLocator';
import { GeoPoint } from '../providers/geoLocator/geoPoint';
import { GeoStorage } from '../providers/geoLocator/geoStorage';

@Component({
  selector: 'app-track',
  templateUrl: './track.page.html',
  styleUrls: ['./track.page.scss'],
})
export class TrackPage implements AfterContentInit{

  isSuspended: boolean = false;
  isRunning: boolean = false;
  isUnlock: boolean = false;
  center: GeoPoint = new GeoPoint(0,0);
  zoom: number = 3;
  marker: GeoPoint = new GeoPoint(0,0);
  height: string = '0px';

  constructor( 
    private geoStorage: GeoStorage, 
    public activityWatcher: ActivityWatcher,
    private el: ElementRef,
    private geolocator:GeoLocator
  ){}

  ngAfterContentInit(): void {
    this.geolocator.getCordinates()
    .then( (point) => { 
      this.center = point; 
      this.zoom = 18;
      this.marker = point;
    })
  }

  getHight(): string {
    let navigation = this.el.nativeElement.querySelector("#navigation").getBoundingClientRect().height;
    let content = this.el.nativeElement.querySelector("ion-content").getBoundingClientRect().height;
    let mapHeight = content - navigation;
    return mapHeight + "px";
  }

  traceLocation() {
    this.activityWatcher.start();
    this.isRunning = true;
  }

  stopLocation() {
    this.isSuspended = false;
    this.isUnlock = false;
    this.isRunning=false;
    this.activityWatcher.stop();
    this.geoStorage.addTrack(this.activityWatcher.track);
  }

  pauseLocation() {
    this.isSuspended = true;
    this.activityWatcher.suspend();
  }

  unlock(){
    this.isUnlock = true;
  }

  lock(){
    if (this.isSuspended){
      this.isSuspended = false;
      this.activityWatcher.start();
    }
    this.isUnlock = false;
  }
}
