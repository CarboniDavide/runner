import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { GeoTrack } from '../GeoProvider/geoTrack';
import { Router } from '@angular/router';
import { GeoWatcher } from '../GeoProvider/geoWatcher';
import { GeoPoint } from '../GeoProvider/geoPoint';
import { Time } from 'jts-timer';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(public geoStorage: GeoStorage, private route: Router, public geoWatcher: GeoWatcher){
    this.tracks = this.geoStorage.tracks;
  }

  clearStorage(){
    this.geoStorage.clear();
    this.tracks = this.geoStorage.tracks;
  }

  showTrack(name){
    this.geoStorage.cTrack = this.tracks.find(el => el.name == name);
    this.route.navigate(['/home/map']);
  }

  getTime(time:number): any{
    let data = new Date(time);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return data.getDate().toString() + " " +  months[data.getMonth()] + " " + data.getFullYear().toString();
  }

  getDuration(track:GeoTrack){
    let time = new Time(track.startAt, track.endAt);
    return time.hours.toString() + " h " +  time.minutes.toString() + " m " +  time.seconds.toString() + " s ";
  }
}

