import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeoLocatorProvider, GpsState } from "./geoLocatorProvider";
import { GeoPoint } from "./geoPoint";
import { IonicNativeLocatorProvider } from "./ionicNativeLocatorProvider";

class GeoLocatorFactory {

    static getGeolocatorProvider(): GeoLocatorProvider {
        return new IonicNativeLocatorProvider();
    }
}

@Injectable()
export class GeoLocator {

    private readonly MIN_ACCURACCY_REQUIRED = 20;

    private _geoProvider: GeoLocatorProvider;

    constructor() {
        this._geoProvider = GeoLocatorFactory.getGeolocatorProvider();
    }

    async getCordinates(options = {}): Promise <GeoPoint|any> {

        if (Object.keys(options).length === 0) { return this._geoProvider.getCordinates() };

        let gpsAccuracy = options['min_accuracy'] != null ? options['min_accuracy'] : this.MIN_ACCURACCY_REQUIRED;

        return new Promise((resolve, rejects ) => {
           this._geoProvider.getCordinates().then( (res: GeoPoint) => { 
                if (res.accuracy <= gpsAccuracy) { resolve(res); }
            }).catch( (error) => { 
                rejects(error);
            });
        });
    }

    watchPosition(options = {}): Observable <GeoPoint|any>{

        if (Object.keys(options).length === 0) { return this._geoProvider.watchPosition() };

        let gpsAccuracy = options['min_accuracy'] != null ? options['min_accuracy'] : this.MIN_ACCURACCY_REQUIRED;
        
        return new Observable((observer: GeoPoint | any) => {
            let watch = this._geoProvider.watchPosition();
            watch.subscribe(
                (res: GeoPoint) => { if (res.accuracy <= gpsAccuracy) { observer.next(res); } },
                (err: any) => { observer.error(err); }
            )
        });
    }

    public get gpsState(): GpsState { return this._geoProvider.gpsState; }

}