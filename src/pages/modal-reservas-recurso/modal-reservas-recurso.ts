import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App, LoadingController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { Reserva } from '../../modelo/reserva';
import { LoginPage } from '../login/login';
import * as _ from 'underscore';

/**
 * Generated class for the ModalReservasRecursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-reservas-recurso',
  templateUrl: 'modal-reservas-recurso.html',
})
export class ModalReservasRecursoPage {
  public buscador: any = "";
  public recurso: Recurso
  public reservas: Reserva[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App, public loadingCtrl: LoadingController
  ) {
    this.recurso = navParams.get('recurso');
  }

  ionViewDidLoad() {
    this.getReservas(null);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getReservas(refresher) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Loading Please Wait...'
    });

    loading.present();
    let fechaSeleccionada;
    if (this.buscador !== "") {
      let fecha = this.buscador.split("-");
      fechaSeleccionada = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
    } else {
      fechaSeleccionada = "";
    }

    this._reservaService.getReservas(fechaSeleccionada, this.recurso.id).subscribe(
      (response: any) => {
        this.reservas = response;
        console.log(this.reservas);
        this.reservas = _(this.reservas).chain()
          .sortBy('fechas_reservas[0]')
          .sortBy('intervalos_reservas[0]')
          .value();
        if (refresher != null) {
          refresher.complete();
        }

        loading.dismiss();
      },
      (error: any) => {
        if (error.status == 403) {
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
        }
        console.log(error);
      }
    );
  }
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener reservas',
      duration: 3000
    });
    toast.present();
  }

  getItems() {
    let fecha = this.buscador.split("-");
    let fechaSeleccionada = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
    this.reservas = this.reservas.filter((reserva: Reserva) => reserva.fechas_reservas[0] === fechaSeleccionada);
  }

}
