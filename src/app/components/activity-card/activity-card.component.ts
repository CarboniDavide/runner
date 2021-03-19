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

  ngOnInit() {}

  showTrack(){
    this.exchanger.selecteTrack = this.track;
    this.route.navigate(['/home/map']);
  }

  getTime(time:number): any{
    let data = new Date(time);
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return data.getDate().toString() + " " +  months[data.getMonth()] + " " + data.getFullYear().toString();
  }

  getDuration(track:GeoTrack){
    let time = new Time(track.startAt, track.endAt);
    return time.hours.toString() + " h " +  time.minutes.toString() + " m " +  time.seconds.toString() + " s ";
  }

}
