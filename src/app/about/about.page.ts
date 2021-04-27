import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActivityWatcher } from '../providers/geoLocator/activityWatcher';
import { GeoStorage } from '../providers/geoLocator/geoStorage';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    public activityWatcher: ActivityWatcher, 
    private geoStorage: GeoStorage, 
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  getAccuracy(event){
    this.activityWatcher.maxAccuracy = event.detail.value;
    if (this.activityWatcher.isRunning) { 
      this.activityWatcher.clear();
      this.activityWatcher.start();
    }
  }

  clearStorage(){
    this.geoStorage.clear();
  }

  async confirmDelete() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Storage Delete',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text : 'Delete',
          handler: this.clearStorage.bind(this)
        }
        ]
    });

    await alert.present();
  }

}
