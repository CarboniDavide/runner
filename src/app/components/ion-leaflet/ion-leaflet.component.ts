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

  private _startMarker: any = null;
  private _endMarker: any = null;
  private _marker: any = null;
  private _polyline: any = null;
  private _map: Leaflet.Map;
  private _circle: any = null;
  
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
    minZoom: 3,
    zoom: this.zoom
  }

  constructor(private _el: ElementRef) { }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.track) { this.addTrackToMap(); }
    if (changes.marker) { this.addCircleMarkerToMap(); }
    if (changes.center) { this.setMapCenter(); }
    if (changes.zoom) { this.setZoom(); }
    setTimeout(() => { this._map.invalidateSize(); }, 0);
  }

  ngOnInit() { this.leafletMap(); }

  ngOnDestroy() { this._map.remove(); }

  leafletMap() {
    try {
      Leaflet.Marker.prototype.options.icon = this.iconDefault;                    // load personale marker
      this._map = new Leaflet.map(this._el.nativeElement.querySelector("#mapId"), this.options).setView([this.center.latitude, this.center.longitude]);
      this._map.on('resize', this.setMapCenter.bind(this));
      Leaflet.tileLayer(this.style["mapNick"]).addTo(this._map);
      //Leaflet.control.scale().addTo(this._map);
      setTimeout(() => { this._map.invalidateSize(); }, 0);                         // wait while map is fully initilized
    } catch {}
  }

  addTrackToMap() {
    if (this.track == null) { return }
    if (this._map == null) { 
      this.leafletMap();                                                            // initialise map before
      setTimeout(() => { this.addTrackToMap(); }, 0);                               // add track after map is fully initialized
      return;
    }                        
    let line = this.track.points.map( p => ([p.latitude, p.longitude]) )            // prepare a new line using lat and long from ponits
    this.removeTrackFromMap();                                                      // remove old polyline before
    this.removeMarkerToMap();                                                       // remove old marker from map
    this.removeUiToMap(this._startMarker);
    this.removeUiToMap(this._endMarker);
    this._polyline = Leaflet.polyline(line, this.polylineOptions).addTo(this._map);      // add new polyline
    if (this.track.points.length != 0){                                             // use a valid track (with almost one point)
      this._map.fitBounds(this._polyline.getBounds());                              // zoom the map to the polyline
      let firstPoint = this.track.points[0];
      let lastPoint = this.track.points[this.track.points.length - 1];
      this._startMarker = Leaflet.circleMarker([firstPoint.latitude, firstPoint.longitude], this.startMarkerOptions).addTo(this._map);
      this._endMarker = Leaflet.circleMarker([lastPoint.latitude, lastPoint.longitude], this.endMarkerOptions).addTo(this._map);
    }
  }

  removeTrackFromMap() {
    if (this._polyline != null) { this._polyline.remove(this._map);}
  }


  addCircleToMap(){
    if (this._map == null) {  
      this.leafletMap();                                                         // initialise map before
      setTimeout(() => { this.addCircleToMap(); }, 0);                           // add track after map is fully initialized
      return;
    }    

    this.removeCircleFromMap();
    Leaflet.circle([
      this.center.latitude, this.center.longitude], this.circleOptions).addTo(this._map);
  }

  removeCircleFromMap() {
    if (this._circle != null) { this._circle.remove(this._map);}
  }

  addMarkerToMap(){
    if (this.marker == null) { return }
    if (this._map == null) {  
      this.leafletMap();                                                         // initialise map before
      setTimeout(() => { this.addMarkerToMap(); }, 0);                           // add track after map is fully initialized
      return;
    }    

    this.removeMarkerToMap();
    this._marker = Leaflet.marker([this.marker.latitude, this.marker.longitude]).addTo(this._map);
  }

  removeMarkerToMap(){
    if (this._marker != null) { this._marker.remove(this._map); }
  }

  addCircleMarkerToMap(){
    if (this.marker == null) { return }
    if (this._map == null) {  
      this.leafletMap();                                                         // initialise map before
      setTimeout(() => { this.addCircleMarkerToMap(); }, 0);                           // add track after map is fully initialized
      return;
    }    

    this.removeCircleMarkerToMap();
    this._marker = Leaflet.circleMarker([this.marker.latitude, this.marker.longitude], this.circleMarkerOptions).addTo(this._map);
  }

  removeCircleMarkerToMap(){
    if (this._marker != null) { this._marker.remove(this._map); }
  }

  setMapCenter(){
    if (this.center == null ){ return }
    if (this._map == null) { 
      this.leafletMap();                                                        // initialise map before
      setTimeout(() => { this.setMapCenter(); }, 0);                            // add track after map is fully initialized
      return;
    }    
    this._map.setView([this.center.latitude, this.center.longitude]);
  }

  setZoom(){
    if (this.center == null){ return }
    if (this._map == null) { 
      this.leafletMap();                                                        // initialise map before
      setTimeout(() => { this.setZoom(); }, 0);                                 // add track after map is fully initialized
      return;
    }   
    this._map.setView([this.center.latitude, this.center.longitude], this.zoom);
  }

  removeUiToMap(el){
    if (el != null) { el.remove(this._map); }
  }

}
