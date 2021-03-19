import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoTrack } from '../providers/geoLocator/geoTrack';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';
import { Exchanger } from '../providers/exchanger';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(
    public geoStorage: GeoStorage, 
    public geoWatcher: GeoWatcher, 
    public exchanger: Exchanger 
  ){
    this.tracks = this.geoStorage.tracks;
  }

  ionViewDidEnter(): void {
    this.tracks = this.geoStorage.tracks;
  }

  getTotalDistance(): number{
    let totalDistance = 0;
    this.tracks.forEach( el =>{
      totalDistance = totalDistance + el.distance;
    });
    return totalDistance;
  }

  doRefresh(event) {
    let escape: boolean = false;
    let waiter = setTimeout(() => {
      if (escape) { event.target.complete(); }
    }, 10000);
    this.tracks = this.geoStorage.tracks;
    escape = true;
    event.target.complete();
    clearTimeout(waiter);
  }
}

