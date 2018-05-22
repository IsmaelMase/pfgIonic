import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalIncidenciaPage } from './modal-incidencia';

@NgModule({
  declarations: [
    ModalIncidenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalIncidenciaPage),
  ],
})
export class ModalIncidenciaPageModule {}
