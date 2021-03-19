import { GeolibInputCoordinates } from 'geolib/es/types';
import { Timer } from 'jts-timer';
import { GeoPoint } from './geoPoint';
import { getCenter, getDistance } from 'geolib';
import { GeoLocator } from './geoLocator';

export class GeoUtils {

    static convertGeoPointtoGeoLibPoint(geoPoint: GeoPoint): GeolibInputCoordinates{
        return { 
            latitude: geoPoint.latitude, 
            longitude: geoPoint.longitude 
        } 
    }

    static async getAvgCordinates(): Promise<GeoPoint|any>{

        let promise = new Promise<Array<GeoPoint>>((resolve, reject) => {
          let points: Array<GeoPoint> = [];
          let timer: Timer = new Timer(100);
          let geolocator: GeoLocator = new GeoLocator();

          timer.onClock = () => {
    
            if (points.length == 10) {
              resolve(points); 
              timer.stop();
            }
    
            geolocator.getCordinates().then( (res)=>{
              if (res != null) { 
                points.push(res); 
              }
            }).catch( (error) =>{
              reject(error);
            });
          };
          
          timer.start();
        });
        
        return new Promise((resolve, rejects ) => {
          promise
          .then( (res) => { 
            let center:any = null;
            let points: Array<GeolibInputCoordinates> = [];
            res.forEach(p => points.push(GeoUtils.convertGeoPointtoGeoLibPoint(p)));
            center = getCenter(points);
            if (center == false) { rejects("no center"); }
            resolve(new GeoPoint(center['latitude'], center['longitude'], null, null, null, null, null));
          })
          .catch( (error) => { 
            rejects(error);
          });
        });
      }

      static getDistance(from: GeoPoint, to: GeoPoint): number {
        return getDistance(
          GeoUtils.convertGeoPointtoGeoLibPoint(from),
          GeoUtils.convertGeoPointtoGeoLibPoint(to),
          0.5);
      }

}