import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GeoPoint } from 'src/app/providers/geoLocator/geoPoint';
import { GeoTrack } from 'src/app/providers/geoLocator/geoTrack';
import * as Leaflet from 'leaflet'; 

@Component({
  selector: 'app-ion-leaflet',
  templateUrl: './ion-leaflet.component.html',
  styleUrls: ['./ion-leaflet.component.scss'],
})
export class IonLeafletComponent implements OnInit, OnChanges, OnDestroy {

  @Input() track?: GeoTrack = null;
  @Input() marker?: GeoPoint = null;
  @Input() center?: GeoPoint = new GeoPoint(0,0);
  @Input() zoom?: number = 3;
  @Input() width?: string = '100%';
  @Input() height?: string = '100%';
  @Input() opacity?: number = 1;
  @Input() liveTrack?: boolean = false;
  @Input() useScale?: boolean = false;

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

  // define base polyline
  polylineOptions = {
    color: 'rgba(0,128,255,1)',
    smoothFactor: 1,
    weight: 7,
    lineCap: "round",
    lineJoin: "round"
  }

  // define circle options
  circleOptions = {
    stroke: true,
    weight: "8",
    color: "green",
    fillColor: "white",
    fillOpacity: 1,
    radius: 5.0,
  }

  // define circle marker options
  circleMarkerOptions = {
    stroke: true,
    weight: "7",
    color: "rgba(0,128,255,1)",
    fillColor: "white",
    fillOpacity: 1,
    radius: 10.0,
  }

  // define circle marker options
  startMarkerOptions = {
    stroke: true,
    weight: "7",
    color: "rgba(76,153,0,1)",
    fillColor: "white",
    fillOpacity: 1,
    radius: 10.0,
  }

  // define circle marker options
  endMarkerOptions = {
    stroke: true,
    weight: "7",
    color: "rgba(255,51,51,1)",
    fillColor: "white",
    fillOpacity: 1,
    radius: 10.0,
  }

  // define a list of map's style
  mapStyle: any = {
    mapNick: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    sat: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    cycle: 'https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    stamen: 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}{r}.png'
  }

  // map initial style
  mapOptions: any = {
    attributionControl: false,
    zoomControl: false,
    draggable: true,
    minZoom: 3,
    zoom: this.zoom
  }

  private _startMarker: any = null;
  private _endMarker: any = null;
  private _marker: any = null;
  private _polyline: any = null;
  private _map: Leaflet.Map;

  constructor(private _el: ElementRef) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.track)  { this.addTrackToMap(); }
    if (changes.marker) { this.addCircleMarkerToMap(); }
    if (changes.center) { this.setMapCenter(); }
    if (changes.zoom)   { this.setZoom(); }
  }

  ngOnInit() { this.loadLeafletMap(); }

  ngOnDestroy() { this._map.remove(); }

  loadLeafletMap() {
    try {
      Leaflet.Marker.prototype.options.icon = this.iconDefault;                                       // load personale marker
      this._map = new Leaflet.map(this._el.nativeElement.querySelector("#mapId"), this.mapOptions);   // create leafletmap
      this._map.setView([this.center.latitude, this.center.longitude]);                               // set center
      this._map.on('resize', this.setMapCenter.bind(this));                                           // event on resize
      Leaflet.tileLayer(this.mapStyle["mapNick"]).addTo(this._map);                                   // define map type
      if (this.useScale) { Leaflet.control.scale().addTo(this._map); }                                // show / hide scale  
      setTimeout(() => { this._map.invalidateSize(); }, 0);                                           // wait while map is fully initilized
    } catch {}
  }

  addTrackToMap() {
    if (this._map == null) { this.loadLeafletMap(); }
    if ( this.track == null || this.track.points.length == 0) { return }      
    this.removeUiToMap(this._polyline, this._marker, this._startMarker, this._endMarker); // remove old ui elements from map

    let line = this.track.points.map( p => ([p.latitude, p.longitude]) )                  // prepare a new line using lat and long from ponits
    this._polyline = Leaflet.polyline(line, this.polylineOptions).addTo(this._map);       // add new polyline

    let firstPoint = this.track.points[0];
    let lastPoint = this.track.points[this.track.points.length - 1];
    this._startMarker = Leaflet.circleMarker([firstPoint.latitude, firstPoint.longitude], this.startMarkerOptions).addTo(this._map);
    this._endMarker = Leaflet.circleMarker([lastPoint.latitude, lastPoint.longitude], this.endMarkerOptions).addTo(this._map);
    this._map.fitBounds(this._polyline.getBounds());                                      // zoom the map to the polyline
  }

  addMarkerToMap(){
    if (this._map == null) { this.loadLeafletMap(); }
    this.removeUiToMap(this._marker);
    this._marker = Leaflet.marker([this.marker.latitude, this.marker.longitude]).addTo(this._map);
  }

  addCircleMarkerToMap(){
    if (this._map == null) { this.loadLeafletMap(); }
    this.removeUiToMap(this._marker);
    this._marker = Leaflet.circleMarker([this.marker.latitude, this.marker.longitude], this.circleMarkerOptions).addTo(this._map);
  }

  setMapCenter(){
    if (this._map == null) { this.loadLeafletMap(); }
    if (this.center == null) { return }
    this._map.setView([this.center.latitude, this.center.longitude]);
    setTimeout(() => { this._map.invalidateSize(); }, 0);
  }

  setZoom(){
    if (this._map == null) { this.loadLeafletMap(); }
    if (this.zoom == null) { return }
    this._map.setView([this.center.latitude, this.center.longitude], this.zoom);
    setTimeout(() => { this._map.invalidateSize(); }, 0);
  }

  removeUiToMap(...elements){
    elements.forEach( (el) => {
      if (el != null) { el.remove(this._map); }
    })
  }

}
