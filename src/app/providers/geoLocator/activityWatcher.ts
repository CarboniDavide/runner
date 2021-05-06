import { Injectable } from "@angular/core";
import { Timer } from "jts-timer";
import { Subscription } from "rxjs";
import { GeoLocator } from "./geoLocator";
import { GeoPoint } from "./geoPoint";
import { GeoTrack } from "./geoTrack";
import { GeneralSetting } from '../generalSetting';

export enum ActivityWatcherSate {
    Run = "Run",
    Stop = "Stop",
    Pause = "Pause",
    Suspend = "Suspend",
    Clear = "Clear"
}

@Injectable()
export class ActivityWatcher{
    
    oldPoint: GeoPoint;
    watcher?: Subscription = null;
    error?: string = null;
    maxAccuracy?: number = null;
    totalDistance: number = 0;
    track: GeoTrack = null;
    timer: Timer = null;
    geolocator: GeoLocator = null;
    isReady: Boolean = false;

    private _currentPoint: GeoPoint;
    public get currentPoint(): GeoPoint { return this._currentPoint; }
    public set currentPoint(value: GeoPoint) { this._currentPoint = value; this._refresh(); }

    private _state: ActivityWatcherSate;
    public get state(): ActivityWatcherSate { return this._state; }
    public set state(value: ActivityWatcherSate) { this._state = value; eval("this.on" + this.state.charAt(0).toUpperCase() + this.state.slice(1) + "()"); }

    private _onNewLocation?: Function = () => {};
    public get onNewLocation(): Function | null { return this._onNewLocation; }
    public set onNewLocation(value: Function | null) { this._onNewLocation = (value == null) ? () => {} : value; }

    private _onClear?: Function = () => {};
    public get onClear(): Function | null { return this._onClear; }
    public set onClear(value: Function | null) { this._onClear = (value == null) ? () => {} : value; }
    
    private _onPause?: Function = () => {};
    public get onPause(): Function | null { return this._onPause; }
    public set onPause(value: Function | null) { this._onPause = (value == null) ? () => {} : value; }
    
    private _onSuspend?: Function = () => {};
    public get onSuspend(): Function | null { return this._onSuspend; }
    public set onSuspend(value: Function | null) { this._onSuspend = (value == null) ? () => {} : value; }

    private _onStop?: Function = () => {};
    public get onStop(): Function | null { return this._onStop; }
    public set onStop(value: Function | null) { this._onStop = (value == null) ? () => {} : value; }

    private _onRun?: Function = () => {};
    public get onRun(): Function | null { return this._onRun; }
    public set onRun(value: Function | null) { this._onRun = (value == null) ? () => {} : value; }

    constructor(private gSetting: GeneralSetting){
        this.geolocator = new GeoLocator();
        this._init().then( () => { this._gpsRun(); }) ;
    }

    private _init(): Promise<any>{
        return new Promise((resolve, rejects ) => {
            this.track = new GeoTrack();
            this.totalDistance = 0;
            this.error = null;
            this.timer = new Timer();
            if (this.watcher != null){ this.watcher.unsubscribe; }
            this.gSetting.getAccuracy().then( (r) => { 
                this.maxAccuracy = r; 
                resolve(true);
            }).catch( (error) => { 
                rejects(error);
            });
        });
    }

    private _gpsRun(){
        this.isReady = false;
        
        this.watcher = this.geolocator.watchPosition( { min_accuracy: this.maxAccuracy }).subscribe(
        (res) => {
            this.error = null;
            if (this.currentPoint != null){ this.oldPoint = this.currentPoint; }
            this.currentPoint = res; 
            this.isReady = true;
            this.onNewLocation();
        },
        (error) => { this.error = error.message; }
        );
    }

    private _gpsStop(){
        if (this.watcher != null) { this.watcher.unsubscribe(); }
    }

    private _refresh(){
        if (this.state != ActivityWatcherSate.Run){ return; }
        this.track.points.push(this.currentPoint);
        if (this.oldPoint == null){ return }
        this.totalDistance = this.totalDistance + this.track.getABDistance(this.oldPoint, this.currentPoint);
    }

    run(){
        if (this.state == ActivityWatcherSate.Run) { return; }
        if (this.state == ActivityWatcherSate.Stop) { this._init(); }
        this.state = ActivityWatcherSate.Run;
        this.timer.start();
    }

    stop(){
        if (this.state == ActivityWatcherSate.Stop) { return; }
        this.state = ActivityWatcherSate.Stop;
        this.track.endAt = new Date().getTime();
        this.timer.stop();
    }

    suspend(){
        if (this.state == ActivityWatcherSate.Suspend) { return; }
        this.state = ActivityWatcherSate.Suspend;
        this.timer.suspend();
    }

    pause(){
        if (this.state == ActivityWatcherSate.Pause) { return; }
        this.state = ActivityWatcherSate.Pause;
        this.timer.pause();
    }

    clear(){
        if (this.state == ActivityWatcherSate.Clear) { return; }
        this.state = ActivityWatcherSate.Clear;
        this.stop();
        this._gpsStop();
        this._init().then( () => { this._gpsRun(); }) ;
    }
}