import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonProgressiveCircleButtonComponent } from './ion-progressive-circle-button/ion-progressive-circle-button.component';
import { RoundButtomComponent } from './round-buttom/round-buttom.component';
import { IonLeafletComponent } from './ion-leaflet/ion-leaflet.component';
import { ActivityCardComponent } from './activity-card/activity-card.component';

@NgModule({
  declarations: [ 
    IonProgressiveCircleButtonComponent, 
    RoundButtomComponent,
    ActivityCardComponent,
    IonLeafletComponent
  ],
  exports: [ 
    RoundButtomComponent, 
    ActivityCardComponent,
    IonLeafletComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
