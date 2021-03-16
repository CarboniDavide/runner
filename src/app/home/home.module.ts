import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocator } from '../GeoProvider/geolocator';
import { IonicStorageModule } from '@ionic/storage';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [ Geolocation, Geolocator ],
  declarations: [HomePage]
})
export class HomePageModule {}
