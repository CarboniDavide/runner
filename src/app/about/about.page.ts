import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GeneralSetting } from '../providers/generalSetting';
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
    private alertController: AlertController,
    public gSetting: GeneralSetting
  ) { }

  ngOnInit() {}

  changeAccuracy(event){
    this.gSetting.setAccuracy(event.detail.value);
    let nextState = this.activityWatcher.state;
    this.activityWatcher.clear();
    if (nextState == "Run") { this.activityWatcher.run(); }
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
