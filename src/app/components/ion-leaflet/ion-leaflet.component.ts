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
  @Input() enableMarker?: Boolean = true;

  // define personale marker
  iconDefault = Leaflet.icon({
    iconUrl: 'assets/map/marker-icon.png',
    iconRetinaUrl: 'assets/map/marker-icon-2x.png',
    shadowUrl: 'assets/map/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });

  marker: any = null;
  polyline: any = null;
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

  // options: any = {
  //   attributionControl: false,
  //   center: [ this.lat, this.lng ],
  //   zoomControl: false,
  //   draggable: true,
  //   zoom: 18,
  //   minZoom: 3
  // }

  constructor() { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.track) { setTimeout(() => { this.addTrackToMap(); }, 0); }
  }

  ngOnInit() {
    this.leafletMap();
    setTimeout(() => { this.map.invalidateSize(); }, 0);
  }

  ngOnDestroy() {
    this.map.remove();
  }

  leafletMap() {
    Leaflet.Marker.prototype.options.icon = this.iconDefault;   // load personale marker
    this.map = Leaflet.map('mapId', this.options).setView([this.lat, this.lng], this.zoomLevel);
    Leaflet.tileLayer(this.style["mapNick"]).addTo(this.map);
    Leaflet.control.scale().addTo(this.map);
    if (this.enableMarker) { this.addMarkerToMap() };
  }

  addTrackToMap() {
    if (this.track == null) { return }
    let line = this.track.points.map( p => ([p.latitude, p.longitude]) )        // prepare a new line using lat and long from ponits
    this.removeTrackFromMap();                                                  // remove old polyline before
    this.removeMarkerToMap();                                                   // remove old marker from map
    this.polyline = Leaflet.polyline(line, {color: 'red'}).addTo(this.map);     // add new polyline
    this.map.fitBounds(this.polyline.getBounds());                              // zoom the map to the polyline
  }

  removeTrackFromMap() {
    if (this.polyline != null) { this.polyline.remove(this.map);}
  }

  addMarkerToMap(){
    this.marker = Leaflet.marker([this.lat, this.lng]).addTo(this.map);
  }

  removeMarkerToMap(){
    if (this.marker != null) { this.marker.remove(this.map); }
  }

}
