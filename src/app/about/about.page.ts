import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(
    public geoWatcher: GeoWatcher, 
    private geoStorage: GeoStorage, 
    private alertController: AlertController
  ) { }

  ngOnInit() {}

  getAccuracy(event){
    this.geoWatcher.maxAccuracy = event.detail.value;
    if (this.geoWatcher.isRunning) { 
      this.geoWatcher.stop(); 
      this.geoWatcher.start();
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
