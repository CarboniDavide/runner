import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Time } from 'jts-timer';
import { Exchanger } from 'src/app/providers/exchanger';
import { GeoTrack } from 'src/app/providers/geoLocator/geoTrack';
import { GeoWatcher } from 'src/app/providers/geoLocator/geoWatcher';

@Component({
  selector: 'app-activity-card',
  templateUrl: './activity-card.component.html',
  styleUrls: ['./activity-card.component.scss'],
})
export class ActivityCardComponent implements OnInit {
  @Input() track: GeoTrack;

  constructor(
    private exchanger: Exchanger, 
    private route: Router, 
    public geoWatcher: GeoWatcher
  ) { }

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

}
