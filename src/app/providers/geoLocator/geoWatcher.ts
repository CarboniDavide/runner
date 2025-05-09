import { Injectable } from "@angular/core";
import { Timer } from "jts-timer";
import { Subscription } from "rxjs";
import { GeoLocator } from "./geoLocator";
import { GeoPoint } from "./geoPoint";
import { GeoTrack } from "./geoTrack";
import { GeoUtils } from "./geoUtils";

export enum GeoWatcherSate {
    Ready = "Ready",
    WaitForGps = "Wait GPS Position",
    Watching = "Watching",
    Aborted = "Aborted",
    Stop = "Stop",
    Pause = "Pause",
    Suspend = "Suspend"
}

@Injectable()
export class GeoWatcher{

    readonly DEFAULAT_MAX_ACCURACY = 30;

    currentPoint: GeoPoint;
    oldPoint: GeoPoint;

    watcher?: Subscription = null;
    error?: string = null;
    maxAccuracy: number = this.DEFAULAT_MAX_ACCURACY;
    state: GeoWatcherSate = GeoWatcherSate.Ready;
    totalDistance: number = 0;
    track: GeoTrack = null;
    timer: Timer = new Timer();
    isRunning: Boolean = false;

    constructor(private geolocator: GeoLocator){}

    private _init(){
        this.track = new GeoTrack();
        this.totalDistance = 0;
        this.state = GeoWatcherSate.Ready;
        this.error = null;
        if (this.timer != null) { this.timer.stop(); }
        this.timer = new Timer();
        if (this.watcher != null){ this.watcher.unsubscribe; }
    }

    private _run(){
        this.state = GeoWatcherSate.WaitForGps;
        this.watcher = this.geolocator.watchPosition().subscribe(
        (res) => {
            this.error = null;
            if (res.accuracy > this.maxAccuracy ){ return; }
            this.oldPoint = this.currentPoint;
            this.currentPoint = res; 
            this.geolocator.lastPosition = res;
            this.state = GeoWatcherSate.Watching;
            if (this.oldPoint == null ) { this.track.points.push(this.currentPoint); return; }
            this.totalDistance = this.totalDistance + this.track.getABDistance(this.oldPoint, this.currentPoint);

            //store
            if (
            (this.currentPoint.getLatitude(5) != this.oldPoint.getLatitude(5)) || 
            (this.currentPoint.getLongitude(5) != this.oldPoint.getLongitude(5))){
                this.track.points.push(this.oldPoint);
            }
        },
        (error) => {
            this.error = error.message;
        }
        );
    }

    start(){
        this.isRunning = true;
        if (this.state.toString() == GeoWatcherSate.Watching) { return; }
        if (this.state.toString() == GeoWatcherSate.Ready) { this._init(); }
        if (this.state.toString() == GeoWatcherSate.Stop) { this._init(); }
        this.timer.start();
        if (this.state.toString() == GeoWatcherSate.Pause) { return; }
        if (this.state.toString() == GeoWatcherSate.Suspend) { return; }
        this._run();
    }

    stop(){
        this.isRunning = false;
        this.state = GeoWatcherSate.Stop;
        this.track.endAt = new Date().getTime();
        if (this.timer != null) { this.timer.stop(); }
        if (this.watcher != null) { this.watcher.unsubscribe(); }
    }

    suspend(){
        this.isRunning = false;
        this.state = GeoWatcherSate.Suspend;
        if (this.timer != null) { this.timer.suspend(); }
        if (this.watcher != null) { this.watcher.unsubscribe(); }
    }

    pause(){
        this.isRunning = false;
        this.state = GeoWatcherSate.Pause;
        if (this.timer != null) { this.timer.pause(); }
        if (this.watcher != null) { this.watcher.unsubscribe(); }
    }

    clear(){
        this.stop();
        this._init();
    }
}