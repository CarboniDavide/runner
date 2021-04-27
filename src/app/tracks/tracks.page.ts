import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoTrack } from '../providers/geoLocator/geoTrack';
import { Exchanger } from '../providers/exchanger';
import { ActivityWatcher } from '../providers/geoLocator/activityWatcher';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(
    public geoStorage: GeoStorage, 
    public activityWatcher: ActivityWatcher, 
    public exchanger: Exchanger 
  ){
    this.tracks = this.geoStorage.tracks;
  }

  ionViewDidEnter(): void {
    this.tracks = this.geoStorage.tracks;
  }

  getTotalDistance(): string{
    let totalDistance: number = 0;
    this.tracks.forEach( el => {
      let gt: GeoTrack = new GeoTrack(el.name, el.startAt, el.endAt, el.points);
      totalDistance = ((totalDistance + gt.distance) * 0.001);
    });
    return totalDistance.toFixed(3);
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

