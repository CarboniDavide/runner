import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Exchanger } from '../providers/exchanger';
import { GeoPoint } from '../providers/geoLocator/geoPoint';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoTrack } from '../providers/geoLocator/geoTrack';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, OnDestroy {

  lastPolyline: any = null;
  map: Leaflet.Map;
  lat: any = "46.836794";
  lng: any = "6.552244";
  zoomLevel: any = 13;
  style: any = {
    mapNick: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    sat: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    cycle: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    stamen: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png'
  }
  options: any = {
    attributionControl: false,
    zoomControl: false,
    draggable: true,
    minZoom: 3
  }

  constructor(public geoStorage: GeoStorage, private exchanger: Exchanger) { }
  
  ionViewDidEnter(): void {
    this.leafletMap();
  }

  ngOnInit() {}

  leafletMap() {
    try{
      this.map = Leaflet.map('mapId', this.options).setView([this.lat, this.lng], this.zoomLevel);
      Leaflet.tileLayer(this.style["mapNick"]).addTo(this.map);
      Leaflet.control.scale().addTo(this.map);
    }catch{ }

    // let p = this.geolocator.lastPosition;
    // Leaflet.circle(p.latitude, p.longitude.toString()).addTo(this.map);

    if (this.exchanger.selecteTrack == null) { return; }

    let latlngs: any = [];
  
    this.exchanger.selecteTrack.points.forEach(p => {
      latlngs.push([p.latitude, p.longitude]);
    });


    if (this.lastPolyline != null) { this.lastPolyline.remove(this.map);}
    this.lastPolyline = Leaflet.polyline(latlngs, {color: 'red'}).addTo(this.map);

  }

  /** Remove map when we have multiple map object */
  ngOnDestroy() {
    this.map.remove();
  }

}
