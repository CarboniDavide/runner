import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';
import { GeoTrack } from "./geoTrack";

@Injectable()
export class GeoStorage {

    public tracks: Array<GeoTrack> = new Array<GeoTrack>();

    constructor(private storage: Storage) {
        this.getFromStorage();
    }

    public getFromStorage(){
      this.tracks = new Array<GeoTrack>();
      this.storage.get('tracks').then((res) => {
        this.tracks = (res == null) ? new Array<GeoTrack>(): res;
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

    public addTrack(track: GeoTrack){
      this.tracks.push(track);
      this.store();
    }

    public store(){
      this.storage.set('tracks', this.tracks);
    }
}