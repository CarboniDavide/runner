import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { Exchanger } from '../providers/exchanger';
import { GeoWatcher } from '../providers/geoLocator/geoWatcher';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule
  ],
  declarations: [HomePage],
  providers: [ GeoStorage, GeoWatcher, Exchanger ]
})
export class HomePageModule {}
