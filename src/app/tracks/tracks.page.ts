import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { GeoTrack } from '../GeoProvider/geoTrack';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(public geoStorage: GeoStorage ){
    this.tracks = this.geoStorage.tracks;
  }

  clearStorage(){
    this.geoStorage.clear();
    this.tracks = this.geoStorage.tracks;
  }
}

