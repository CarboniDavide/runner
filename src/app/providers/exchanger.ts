import { Injectable } from "@angular/core";

@Injectable()
export class Exchanger{
    [key: string]: any

    getProperties(): any{
        return Object.getOwnPropertyNames(this);
    }
}