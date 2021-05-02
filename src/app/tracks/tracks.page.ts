import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoTrack } from '../providers/geoLocator/geoTrack';
import { Exchanger } from '../providers/exchanger';
import { ActivityWatcher } from '../providers/geoLocator/activityWatcher';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.page.html',
  styleUrls: ['./tracks.page.scss'],
})
export class TracksPage{

  tracks: Array<GeoTrack> = new Array<GeoTrack>();

  constructor(
    public geoStorage: GeoStorage, 
    public activityWatcher: ActivityWatcher, 
    public exchanger: Exchanger,
    private _element: ElementRef,
    private _renderer: Renderer2
  ){
    this.tracks = this.geoStorage.tracks;
  }

  ionViewDidEnter(): void {
    this.tracks = this.geoStorage.tracks;
  }
  
  shadowed(){
    let list = this._element.nativeElement.querySelector("#activity-list");
    let resume = this._element.nativeElement.querySelector("#resume");
    list.scrollTop != 0 ? this._renderer.addClass(resume, "shadow") : this._renderer.removeClass(resume, "shadow")
  }

  getTotalDistance(): string{
    let totalDistance: number = 0;
    this.tracks.forEach( el => {
      let gt: GeoTrack = new GeoTrack(el.name, el.startAt, el.endAt, el.points);
      totalDistance = totalDistance + gt.distance;
    });
    return totalDistance.toFixed(3);
  }

  doRefresh(event) {
    let escape: boolean = false;
    let waiter = setTimeout(() => {
      if (escape) { event.target.complete(); }
    }, 10000);
    this.tracks = this.geoStorage.tracks;
    escape = true;
    event.target.complete();
    clearTimeout(waiter);
  }

  getHight(): string {
    let resumePanel = this._element.nativeElement.querySelector("#resume").getBoundingClientRect().height;
    let content = this._element.nativeElement.querySelector("ion-content").getBoundingClientRect().height;
    let activityPanelHeight = content - resumePanel;
    return activityPanelHeight + "px";
  }
}

