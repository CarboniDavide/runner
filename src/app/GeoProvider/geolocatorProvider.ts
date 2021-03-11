import { Observable } from 'rxjs';
import { GeoPoint } from './geoPoint';

export abstract class GeolocatorProvider {

    abstract getCordinates(): Promise <GeoPoint|any>;
    abstract watchPosition(): Observable <GeoPoint|any>;
}

