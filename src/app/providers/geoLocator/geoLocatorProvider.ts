import { Observable } from 'rxjs';
import { GeoPoint } from './geoPoint';

export enum GpsState {
    Undefined = "Undefined",
    Waiting = "Waiting",
    Connected = "Connected",
    Aborted = "Aborted",
    Error = "Error"
}

export abstract class GeoLocatorProvider {

    gpsState: GpsState = GpsState.Undefined;
    
    abstract getCordinates(): Promise <GeoPoint|any>;
    abstract watchPosition(): Observable <GeoPoint|any>;
}

