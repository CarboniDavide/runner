import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocator } from '../GeoProvider/geolocator';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  providers: [ Geolocation, Geolocator ],
  declarations: [HomePage]
})
export class HomePageModule {}
