import { Component, OnInit } from '@angular/core';
import { GeoWatcher } from '../GeoProvider/geoWatcher';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(public geoWatcher: GeoWatcher) { }

  ngOnInit() {}

  getAccuracy(event){
    this.geoWatcher.maxAccuracy = event.detail.value;
    if (this.geoWatcher.isRunning) { 
      this.geoWatcher.stop(); 
      this.geoWatcher.start();
    }
  }
}
