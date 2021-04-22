import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as Leaflet from 'leaflet'; 
import { GeoTrack } from 'src/app/providers/geoLocator/geoTrack';

@Component({
  selector: 'app-ion-leaflet',
  templateUrl: './ion-leaflet.component.html',
  styleUrls: ['./ion-leaflet.component.scss'],
})
export class IonLeafletComponent implements OnInit, OnChanges, OnDestroy {

  @Input() track?: GeoTrack = null;

  lastPolyline: any = null;
  map: Leaflet.Map;
  lat: any = "46.829082";
  lng: any = "6.541396";
  zoomLevel: any = 18;
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

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {}

  ngOnDestroy() {
    // Remove map when we have multiple map object
    this.map.remove();
  }

  ionViewDidEnter(): void {
    this.leafletMap();
  }

  leafletMap() {
    try{
      this.map = Leaflet.map('mapId', this.options).setView([this.lat, this.lng], this.zoomLevel);
      Leaflet.tileLayer(this.style["mapNick"]).addTo(this.map);
      Leaflet.control.scale().addTo(this.map);
    }catch{ }

    // let p = this.geolocator.lastPosition;
    // Leaflet.circle(p.latitude, p.longitude.toString()).addTo(this.map);

    if (this.track == null) { return; }

    let latlngs: any = [];
  
    this.track.points.forEach(p => {
      latlngs.push([p.latitude, p.longitude]);
    });


    if (this.lastPolyline != null) { this.lastPolyline.remove(this.map);}
    this.lastPolyline = Leaflet.polyline(latlngs, {color: 'red'}).addTo(this.map);
  }
}
