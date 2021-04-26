import { AfterContentInit, Component } from '@angular/core';
import { Exchanger } from '../providers/exchanger';
import { GeoLocator } from '../providers/geoLocator/geoLocator';
import { GeoPoint } from '../providers/geoLocator/geoPoint';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterContentInit {

  constructor(public exchanger: Exchanger, private geolocator: GeoLocator) { }

  center: GeoPoint = new GeoPoint(0,0);
  zoom: number = 3;
  marker: GeoPoint = new GeoPoint(0,0);

  ngAfterContentInit(): void {
    this.geolocator.getCordinates()
    .then( (point) => { 
      this.center = point; 
      this.zoom = 18;
      this.marker = point;
    })
  }

}
