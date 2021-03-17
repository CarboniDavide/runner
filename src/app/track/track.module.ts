import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocator } from '../GeoProvider/geolocator';
import { IonicModule } from '@ionic/angular';

import { TrackPageRoutingModule } from './track-routing.module';

import { TrackPage } from './track.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackPageRoutingModule
  ],
  declarations: [TrackPage],
  providers: [ Geolocator ],
})
export class TrackPageModule {}
