import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TracksPageRoutingModule } from './tracks-routing.module';

import { TracksPage } from './tracks.page';
import { ActivityCardComponent } from '../components/activity-card/activity-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TracksPageRoutingModule
  ],
  declarations: [TracksPage, ActivityCardComponent]
})
export class TracksPageModule {}
