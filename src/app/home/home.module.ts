import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { GeoLocator } from '../providers/geoLocator/geoLocator';
import { Exchanger } from '../providers/exchanger';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers: [ GeoStorage, GeoLocator, GeoWatcher, Exchanger ]
})
export class HomePageModule {}
