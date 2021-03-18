import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GeoStorage } from '../GeoProvider/geoStorage';
import { Geolocator } from '../GeoProvider/geolocator';
import { GeoWatcher } from '../GeoProvider/geoWatcher';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [ GeoStorage, Geolocator, GeoWatcher ]
})
export class HomePageModule {}
