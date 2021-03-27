import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonProgressiveCircleButtonComponent } from './ion-progressive-circle-button/ion-progressive-circle-button.component';
import { RoundButtomComponent } from './round-buttom/round-buttom.component';

@NgModule({
  declarations: [ IonProgressiveCircleButtonComponent, RoundButtomComponent ],
  exports: [ IonProgressiveCircleButtonComponent, RoundButtomComponent ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
