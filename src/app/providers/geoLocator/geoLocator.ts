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

    geoProvider: GeoLocatorProvider;
    lastPosition: GeoPoint;

    constructor() {
        this.geoProvider = GeoLocatorFactory.getGeolocatorProvider();
    }

    async getCordinates(): Promise <GeoPoint|any> {
        return this.geoProvider.getCordinates();
    }

    watchPosition(): Observable <GeoPoint|any>{
        return this.geoProvider.watchPosition();
    }

    public get gpsState(): GpsState { return this.geoProvider.gpsState; }

}