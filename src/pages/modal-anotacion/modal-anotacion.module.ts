import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAnotacionPage } from './modal-anotacion';

@NgModule({
  declarations: [
    ModalAnotacionPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAnotacionPage),
  ],
})
export class ModalAnotacionPageModule {}
