import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { ModalReservaPage } from '../modal-reserva/modal-reserva';
import { RecursoProvider } from '../../providers/recurso/recurso';
import { Recurso } from '../../modelo/recurso';
import { LoginPage } from '../login/login';
import { ModalIncidenciaPage } from '../modal-incidencia/modal-incidencia';
import { ModalReservasRecursoPageModule } from '../modal-reservas-recurso/modal-reservas-recurso.module';
import { ModalReservasRecursoPage } from '../modal-reservas-recurso/modal-reservas-recurso';
/**
 * Generated class for the RecursosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recursos',
  templateUrl: 'recursos.html',
})
export class RecursosPage {

  public opciones: string;
  public recursos: Recurso[];
  public recursosTotales: Recurso[];
  public buscador: string;
  constructor(public _recursoService: RecursoProvider, public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController, public platform: Platform,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.opciones = "aulas";
    this.cambiarRecursos(null);
  }

  cambiarRecursos(refresher) {
    if (this.opciones === "aulas") {
      this._recursoService.getAulas().subscribe(
        (response: any) => {
          this.recursos = response;
          this.recursosTotales = response;
          console.log(this.recursos);
          if (refresher != null) {
            refresher.complete();
          }
        },
        (error: any) => {
          this.navCtrl.setRoot(LoginPage);
        }
      );
    } else {
      this._recursoService.getOtros().subscribe(
        (response: any) => {
          this.recursos = response;
          console.log(this.recursos);
          if (refresher != null) {
            refresher.complete();
          }
        },
        (error: any) => {
          this.navCtrl.setRoot(LoginPage);
        }
      );
    }
  }

  abrirMenuOpciones(recurso) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      buttons: [
        {
          text: 'Comunicar Incidencia',
          icon: !this.platform.is('ios') ? 'md-alert' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalIncidenciaPage, { 'recurso': recurso });
            modal.present();
          }
        }, {
          text: 'Realizar reserva',
          icon: !this.platform.is('ios') ? 'md-time' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalReservaPage, { 'recurso': recurso });
            modal.present();
          }
        }, {
          text: 'Reservas',
          icon: !this.platform.is('ios') ? 'md-calendar' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalReservasRecursoPage, { 'recurso': recurso });
            modal.present();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'md-close' : null,
          handler: () => {
            console.log('Reserva clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getItems() {
    this.recursos = this.recursosTotales.filter((recurso: Recurso) => recurso.nombre.toUpperCase().includes(this.buscador.toUpperCase()));
  }

}
