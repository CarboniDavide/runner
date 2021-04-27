import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'jts-timer';
import { Exchanger } from 'src/app/providers/exchanger';
import { ActivityWatcher } from 'src/app/providers/geoLocator/activityWatcher';
import { GeoTrack } from 'src/app/providers/geoLocator/geoTrack';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit, AfterViewInit {
  @Input() track: GeoTrack;

  isOpened: boolean = false;

  constructor(
    private exchanger: Exchanger, 
    private route: Router, 
    public activityWatcher: ActivityWatcher,
    private _renderer: Renderer2,
    private _element: ElementRef
  ) { }

  ngAfterViewInit(): void {
    let el = this._element.nativeElement.querySelector("#card-action-buttons");
    let button = this._element.nativeElement.querySelector("#icon-actions-open");
    this._renderer.listen(el, "transitionend", () => {
      this._renderer.setStyle(button, "transform", this.isOpened ? "rotate(180deg)" : "rotate(-0deg)");
    });
  }

  ngOnInit() { 
    let mm = this.track;
    this.track = new GeoTrack(mm.name, mm.startAt, mm.endAt, mm.points);
  }

  showTrack(){
    this.exchanger.selecteTrack = this.track;
    this.route.navigate(['/home/map']);
  }

  getTime(time:number): any{
    let data = new Date(time);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return data.getDate().toString() + " " +  months[data.getMonth()] + " " + data.getFullYear().toString();
  }

  getDuration(){
    let time = new Time(this.track.startAt, this.track.endAt);
    return time.hours.toString() + " h " +  time.minutes.toString() + " m " +  time.seconds.toString() + " s ";
  }

  getDistance(){
    return ( this.track.distance.toFixed(3) );
  }

  actionButtons(event: Event){
    event.stopPropagation();
    let header = this._element.nativeElement.querySelector("ion-card-header");
    this.isOpened ? this._renderer.removeClass(header, "show-actions-buttons") : this._renderer.addClass(header, "show-actions-buttons");
    this.isOpened = !this.isOpened;
  }

}
