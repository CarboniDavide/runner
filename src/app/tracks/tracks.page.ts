import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoTrack } from '../providers/geoLocator/geoTrack';
import { Router } from '@angular/router';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';
import { Time } from 'jts-timer';
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
    private route: Router, 
    public geoWatcher: GeoWatcher, 
    public exchanger: Exchanger 
  ){
    this.tracks = this.geoStorage.tracks;
  }

  clearStorage(){
    this.geoStorage.clear();
    this.tracks = this.geoStorage.tracks;
  }

  showTrack(name){
    this.exchanger.selecteTrack = this.tracks.find(el => el.name == name);
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

