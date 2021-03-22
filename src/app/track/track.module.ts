import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TrackPageRoutingModule } from './track-routing.module';

import { TrackPage } from './track.page';
import { RoundButtomComponent } from '../components/round-buttom/round-buttom.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackPageRoutingModule
  ],
  declarations: [TrackPage, RoundButtomComponent]
})
export class TrackPageModule {}
