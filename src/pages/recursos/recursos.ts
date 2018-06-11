import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ActionSheetController, Platform, LoadingController, App, ToastController, AlertController } from 'ionic-angular';
import { ModalReservaPage } from '../modal-reserva/modal-reserva';
import { RecursoProvider } from '../../providers/recurso/recurso';
import { Recurso } from '../../modelo/recurso';
import { LoginPage } from '../login/login';
import { ModalIncidenciaPage } from '../modal-incidencia/modal-incidencia';
import { ModalReservasRecursoPage } from '../modal-reservas-recurso/modal-reservas-recurso';
import { CONSTANTS } from '../../global/constants';


@IonicPage()
@Component({
  selector: 'page-recursos',
  templateUrl: 'recursos.html',
})
export class RecursosPage {

  public opciones: string;
  public recursos: Recurso[];
  public recursosTotales: Recurso[];
  public buscador: string = "";
  public url = CONSTANTS.url;
  constructor(public _recursoService: RecursoProvider, public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController, public platform: Platform,
    public modalCtrl: ModalController, public loadingCtrl: LoadingController, public app: App,
    public toastCtrl: ToastController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.opciones = "aulas";
    this.cambiarRecursos(null);
  }
  /**
   * Cambiar obtener recursos o aulas
   * @param refresher Refresh elemento para refrescar lista
   */
  cambiarRecursos(refresher) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Cargando. Espere por favor'
    });
    loading.present();
    console.log(this.opciones);
    if (this.opciones === "aulas") {
      this._recursoService.getAulas().subscribe(
        (response: any) => {
          this.recursos = response;
          this.recursosTotales = response;
          this.recursos.sort(this.ordenarAZ);
          this.recursosTotales.sort(this.ordenarAZ);
          console.log(this.recursos);
          this.getItems();
          if (refresher != null) {
            refresher.complete();
          }
          loading.dismiss();
        },
        (error: any) => {
          if (error.status == 403) {
            localStorage.clear();
            loading.dismiss();
            this.app.getRootNav().setRoot(LoginPage);
          } else {
            this.mostrarMensajeIncorrecto();
            loading.dismiss();
          }
        }
      );
    } else {
      this._recursoService.getOtros().subscribe(
        (response: any) => {
          this.recursos = response;
          this.recursosTotales = response;
          this.recursos.sort(this.ordenarAZ);
          this.recursosTotales.sort(this.ordenarAZ);
          console.log(this.recursos);
          this.getItems();
          if (refresher != null) {
            refresher.complete();
          }
          loading.dismiss();
        },
        (error: any) => {
          if (error.status == 403) {
            loading.dismiss();
            localStorage.clear();
            this.app.getRootNav().setRoot(LoginPage);
          } else {
            this.mostrarMensajeIncorrecto();
            loading.dismiss();
          }
        }
      );
    }
  }
  /**
   * Abrir menu de opciones para los recursos
   * @param recurso Recurso
   */
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
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'md-close' : null,
          handler: () => {
            console.log('Reserva clicked');
          }
        }, {
          text: 'Ver datos e incidencias',
          icon: !this.platform.is('ios') ? 'md-information-circle' : null,
          handler: () => {
            const alert = this.alertCtrl.create({
              title: 'Datos e incidencias',
              message: 'Datos: '+recurso.datos+'<br><br>Incidencias: '+recurso.incidencia,
              buttons: ['Cerrar']
            });
            alert.present();
          }
        }
      ]
    });
    actionSheet.present();
  }
  /**
   * Filtrar recursos
   */
  getItems() {
    this.recursos = this.recursosTotales.filter((recurso: Recurso) => recurso.nombre.toUpperCase().includes(this.buscador.toUpperCase()));
    this.recursos.sort(this.ordenarAZ);
  }
  /**
   * Mostrar mensaje error en la operacion
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener recursos',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Ordenar recursos alfabeticamente
   * @param a Recurso a
   * @param b Recurso b
   */
  ordenarAZ(a, b) {
    if (a.nombre.toLowerCase() < b.nombre.toLowerCase())
      return -1;
    if (a.nombre.toLowerCase() > b.nombre.toLowerCase())
      return 1;
    return 0;
  }

}
