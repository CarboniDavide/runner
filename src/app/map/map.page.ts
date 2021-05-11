import { AfterContentInit, AfterViewInit, Component } from '@angular/core';
import { Exchanger } from '../providers/exchanger';
import { GeoLocator } from '../providers/geoLocator/geoLocator';
import { GeoPoint } from '../providers/geoLocator/geoPoint';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit {

  constructor(public exchanger: Exchanger, private geolocator: GeoLocator) { }

  center: GeoPoint = new GeoPoint(0,0);
  zoom: number = 3;
  marker: GeoPoint = new GeoPoint(0,0);

  ngAfterViewInit(): void {
    this.zoom = this.exchanger.selecteTrack == null ? this.zoom : null;
    this.marker = this.exchanger.selecteTrack == null ? this.marker : null;
    this.center = this.exchanger.selecteTrack == null ? this.center : null;
    
    this.geolocator.getCordinates()
    .then( (point) => { 
      if (this.exchanger.selecteTrack == null) {
        this.center = point; 
        this.zoom = 18;
        this.marker = point;
      }
    })
  }

}
