import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonProgressiveCircleButtonComponent } from './ion-progressive-circle-button/ion-progressive-circle-button.component';
import { RoundButtomComponent } from './round-buttom/round-buttom.component';
import { IonLeafletComponent } from './ion-leaflet/ion-leaflet.component';
import { ActivityCardComponent } from './activity-card/activity-card.component';
import { IonicModule } from '@ionic/angular';
import { IonUnlockButtonComponent } from './ion-unlock-button/ion-unlock-button.component';

@NgModule({
  declarations: [ 
    IonProgressiveCircleButtonComponent, 
    RoundButtomComponent,
    ActivityCardComponent,
    IonLeafletComponent,
    IonUnlockButtonComponent
  ],
  exports: [ 
    RoundButtomComponent, 
    ActivityCardComponent,
    IonLeafletComponent,
    IonUnlockButtonComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
