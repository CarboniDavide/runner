import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TracksPageRoutingModule } from './tracks-routing.module';

import { TracksPage } from './tracks.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TracksPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TracksPage]
})
export class TracksPageModule {}
