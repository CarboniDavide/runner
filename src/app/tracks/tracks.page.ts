import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { GeoTrack } from '../GeoProvider/geoTrack';
import { Router } from '@angular/router';
import { GeoWatcher } from '../GeoProvider/geoWatcher';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(public geoStorage: GeoStorage, private route: Router, public g: GeoWatcher){
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
}

