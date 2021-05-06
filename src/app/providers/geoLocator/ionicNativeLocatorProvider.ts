import { GeoPoint } from './geoPoint';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { GeoLocatorProvider, GpsState } from './geoLocatorProvider';
import { Observable } from 'rxjs';

export class IonicNativeLocatorProvider extends GeoLocatorProvider {

  private _geolocation: Geolocation;
  private _geoOptions: GeolocationOptions;

  constructor(){
    super();
    this._geolocation = new Geolocation();
    this._geoOptions = { enableHighAccuracy: true, maximumAge: 1000 }
  }  
  
  async getCordinates(): Promise <GeoPoint|any> {
    this.gpsState = GpsState.Waiting;
    return new Promise((resolve, rejects ) => {
      this._geolocation.getCurrentPosition(this._geoOptions)
      .then( (p) => {
        this.gpsState = GpsState.Connected;
        resolve(new GeoPoint(
          p.coords.latitude, 
          p.coords.longitude, 
          p.coords.altitude, 
          p.coords.accuracy, 
          p.coords.altitudeAccuracy,
          p.coords.heading, 
          p.coords.speed, 
          p.timestamp
        ));
      })
      .catch( (error) => { 
        this.gpsState = GpsState.Error;
        rejects(error);
      });
    });
  }

  watchPosition(): Observable <GeoPoint|any> {
    this.gpsState = GpsState.Waiting;
    return new Observable((observer: GeoPoint | any) => {
      // observable execution
      let watch = this._geolocation.watchPosition({enableHighAccuracy:true});
      watch.subscribe( 
        (res: Geoposition) => {
          this.gpsState = GpsState.Connected;
          try {
            observer.next(
              new GeoPoint(
                res.coords.latitude, 
                res.coords.longitude, 
                res.coords.altitude, 
                res.coords.accuracy, 
                res.coords.altitudeAccuracy, 
                res.coords.heading, 
                res.coords.speed, 
                res.timestamp
              )
            );
          } catch(error) {
            this.gpsState = GpsState.Error;
            observer.error(error);
          }
        },
        (err: PositionError) => {
          this.gpsState = GpsState.Error;
          observer.error(err);
        }
      );
    });
  }

}