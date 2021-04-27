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

    readonly DEFAULAT_MAX_ACCURACY = 30;

    currentPoint: GeoPoint;
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
            if (res.accuracy > this.maxAccuracy ){ return; }
            this.oldPoint = this.currentPoint;
            this.currentPoint = res; 
            this.geolocator.lastPosition = res;
            this.isGpsConnected = true;
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

    private _run(){
        if (!this.isGpsConnected){ return; }
        this.state = ActivityWatcherSate.Run;
        if (this.oldPoint == null ) { this.track.points.push(this.currentPoint); return; }
        this.totalDistance = this.totalDistance + this.track.getABDistance(this.oldPoint, this.currentPoint);

        //store
        if (
        (this.currentPoint.getLatitude(5) != this.oldPoint.getLatitude(5)) || 
        (this.currentPoint.getLongitude(5) != this.oldPoint.getLongitude(5))){
            this.track.points.push(this.oldPoint);
        }
    }

    start(){
        this.isRunning = true;
        if (this.state.toString() == ActivityWatcherSate.Run) { return; }
        if (this.state.toString() == ActivityWatcherSate.Stop) { this._init(); }
        this.timer.start();
        if (this.state.toString() == ActivityWatcherSate.Pause) { return; }
        if (this.state.toString() == ActivityWatcherSate.Suspend) { return; }
        this._run();
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