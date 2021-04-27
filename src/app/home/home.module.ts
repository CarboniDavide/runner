import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { GeoStorage } from '../providers/geoLocator/geoStorage';
import { Exchanger } from '../providers/exchanger';
import { ComponentsModule } from '../components/components.module';
import { ActivityWatcher } from '../providers/geoLocator/activityWatcher';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ComponentsModule
  ],
  declarations: [HomePage],
  providers: [ GeoStorage, Exchanger, ActivityWatcher ]
})
export class HomePageModule {}
