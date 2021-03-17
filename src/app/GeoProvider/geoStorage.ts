import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { GeoTrack } from "../GeoProvider/geoTrack";

@Injectable()
export class GeoStorage {

    public tracks: Array<GeoTrack> = new Array<GeoTrack>();

    constructor(private storage: Storage,) {
        this.getFromStorage();
    }

    public getFromStorage(){
      this.tracks = new Array<GeoTrack>();
      this.storage.get('tracks').then((res) => {
        let mm = (res == null) ? new Array<GeoTrack>(): res;
        mm.map(track => this.tracks.push(new GeoTrack(track._name, track._date, track._points)));
      }).catch((err)=> {
      });
    }
   
    public clear(){
      this.tracks = new Array<GeoTrack>();
      this.storage.clear();
    }

    public set(key:string, value:any){
      this.storage.set(key, value);
    }
}