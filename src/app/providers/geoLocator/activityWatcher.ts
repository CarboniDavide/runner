import { Injectable } from "@angular/core";
import { Timer } from "jts-timer";
import { Subscription } from "rxjs";
import { GeoLocator } from "./geoLocator";
import { GeoPoint } from "./geoPoint";
import { GeoTrack } from "./geoTrack";


export enum ActivityWatcherSate {
    Run = "Run",
    Aborted = "Aborted",
    Stop = "Stop",
    Pause = "Pause",
    Suspend = "Suspend"
}

@Injectable()
export class ActivityWatcher{

    readonly DEFAULAT_MAX_ACCURACY = 20;

    private _currentPoint: GeoPoint;
    public get currentPoint(): GeoPoint { return this._currentPoint; }
    public set currentPoint(value: GeoPoint) { this._currentPoint = value; this._refresh(); }
    
    oldPoint: GeoPoint;

    watcher?: Subscription = null;
    error?: string = null;
    maxAccuracy: number = this.DEFAULAT_MAX_ACCURACY;
    state: ActivityWatcherSate = ActivityWatcherSate.Stop;
    totalDistance: number = 0;
    track: GeoTrack = null;
    timer: Timer = new Timer();
    isRunning: Boolean = false;
    geolocator: GeoLocator;
    isGpsConnected: Boolean = false;

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

    private _onStart?: Function = () => {};
    public get onStart(): Function | null { return this._onStart; }
    public set onStart(value: Function | null) { this._onStart = (value == null) ? () => {} : value; }

    constructor(){
        this.geolocator = new GeoLocator();
        this._gpsRun();
    }

    private _init(){
        this.track = new GeoTrack();
        this.totalDistance = 0;
        this.state = ActivityWatcherSate.Stop;
        this.error = null;
        if (this.timer != null) { this.timer.stop(); }
        this.timer = new Timer();
        if (this.watcher != null){ this.watcher.unsubscribe; }
    }

    private _gpsRun(){
        this.isGpsConnected = false;
        this.watcher = this.geolocator.watchPosition().subscribe(
        (res) => {
            this.error = null;
            this.isGpsConnected = true;
            if (res.accuracy > this.maxAccuracy ){ return; }
            if (this.currentPoint != null){ this.oldPoint = this.currentPoint; }
            this.currentPoint = res; 
            this.geolocator.lastPosition = res;
            this.onNewLocation();
        },
        (error) => {
            this.error = error.message;
        }
        );
    }

    private _gpsStop(){
        this.isGpsConnected = false;
        if (this.watcher != null) { this.watcher.unsubscribe(); }
    }

    private _refresh(){
        if (this.state != ActivityWatcherSate.Run){ return; }
        this.track.points.push(this.currentPoint);
        if (this.oldPoint == null){ return }
        this.totalDistance = this.totalDistance + this.track.getABDistance(this.oldPoint, this.currentPoint);
    }

    start(){
        this.isRunning = true;
        if (this.state.toString() == ActivityWatcherSate.Run) { return; }
        if (this.state.toString() == ActivityWatcherSate.Stop) { this._init(); }
        this.timer.start();
        if (this.state.toString() == ActivityWatcherSate.Pause) { return; }
        if (this.state.toString() == ActivityWatcherSate.Suspend) { return; }
        this.state = ActivityWatcherSate.Run;
    }

    stop(){
        this.isRunning = false;
        this.state = ActivityWatcherSate.Stop;
        this.track.endAt = new Date().getTime();
        if (this.timer != null) { this.timer.stop(); }
    }

    suspend(){
        this.isRunning = false;
        this.state = ActivityWatcherSate.Suspend;
        if (this.timer != null) { this.timer.suspend(); }
    }

    pause(){
        this.isRunning = false;
        this.state = ActivityWatcherSate.Pause;
        if (this.timer != null) { this.timer.pause(); }
    }

    clear(){
        this.stop();
        this._gpsStop();
        this._init();
    }
}