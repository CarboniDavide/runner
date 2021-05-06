import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class GeneralSetting{
    private readonly GPS_ACCURACY_KEY = "gpsAccuracy";
    private readonly GPS_ACCURACY_DEFAULT = 5;

    gpsAccuracy?: number;

    constructor(private storage: Storage){
        this.getAccuracy().then(  (r) => { this.gpsAccuracy = r } );
    }

    public async getAccuracy(): Promise<number> { 
        return new Promise((resolve, rejects ) => {
            this.storage.get(this.GPS_ACCURACY_KEY)
            .then(  (r) => resolve(r == null ? this.GPS_ACCURACY_DEFAULT : r) )
            .catch( (r) => resolve(this.GPS_ACCURACY_DEFAULT) )
        });

    }
    public setAccuracy(value: number) { this.storage.set(this.GPS_ACCURACY_KEY, value); }
}