import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeolocatorProvider } from "./geolocatorProvider";
import { GeoPoint } from "./geoPoint";
import { IonicNativeLocatorProvider } from "./ionicNativeLocatorProvider";

class GeoLocatorFactory {

    static getGeolocatorProvider(): GeolocatorProvider {
        return new IonicNativeLocatorProvider();
    }
}

@Injectable()
export class Geolocator {

    geoProvider: GeolocatorProvider;
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

}