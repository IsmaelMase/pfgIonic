import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App, LoadingController, Platform, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { Reserva } from '../../modelo/reserva';
import { LoginPage } from '../login/login';
import * as _ from 'underscore';
import { Usuario } from '../../modelo/usuario';
import { ModalAnotacionPage } from '../modal-anotacion/modal-anotacion';

/**
 * Generated class for the ModalReservasRecursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {
  public buscador: any = "";
  public recurso: Recurso;
  public usuario: Usuario;
  public reservas: Reserva[] = [];
  public reservasTotales: Reserva[] = [];
  public skip: number = -1;
  public continue:boolean=true;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App, public loadingCtrl: LoadingController,
    public platform: Platform, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.recurso = navParams.get('recurso');
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }

  ionViewDidLoad() {
    this.getReservas(null, null);
  }

  eliminarReserva(id: string) {
    this._reservaService.removeReserva(id).subscribe(
      (response: any) => {
        console.log(response)
        this.mostrarMensajeCorrecto();
      },
      (error: any) => {
        if (error.status === 403) {
          localStorage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrectoEliminar();
        }
      }
    );
  }

  getReservas(refresher, infiniteScroll) {
    this.skip = this.skip + 1;
    if (refresher != null) {
      this.skip=0;
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Cargando. Espere por favor'
    });

    loading.present();
    let fechaSeleccionada = "";
    console.log(this.skip);
    this._reservaService.getReservasByUsuario(this.usuario.id, this.skip).subscribe(
      (response: any) => {
        console.log(response.length);
        if(response.length>0){
          this.continue=true
        }else{
          this.continue=false;
        }
        for (let reserva in response) {
          let fechaSeparada=response[reserva].fechas_reservas[0].split("/")
          response[reserva].fechas_reservas[0]=fechaSeparada[2]+"/"+fechaSeparada[1]+"/"+fechaSeparada[0];
          this.reservasTotales.push(response[reserva]);
        }
        this.reservas=[...this.reservasTotales];
        this.getItems();
        if (refresher != null) {
          refresher.complete();
        }
        if (infiniteScroll != null) {
          infiniteScroll.complete();
        }

        loading.dismiss();
      },
      (error: any) => {
        if (error.status === 403) {
          localStorage.clear();
          loading.dismiss();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
          loading.dismiss();
        }
        console.log(error);
      }
    );
  }

  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva Anulada',
      duration: 3000
    });
    toast.present();
  }

  mostrarMensajeIncorrectoEliminar() {
    let toast = this.toastCtrl.create({
      message: 'Error al anular la reserva',
      duration: 3000
    });
    toast.present();
  }

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener reservas',
      duration: 3000
    });
    toast.present();
  }

  getItems() {
    let fechaSeleccionada;
    if (this.buscador !== "") {
      let fecha = this.buscador.split("-");
      fechaSeleccionada = fecha[0] + "/" + fecha[1] + "/" + fecha[1];
      this.reservas = this.reservasTotales.filter((reserva: Reserva) => reserva.fechas_reservas[0] === fechaSeleccionada);
    } else {
      this.reservas = [...this.reservasTotales];
    }
  }

  abrirMenuOpciones(reserva) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      buttons: [
        {
          text: 'Modificar anotación',
          icon: !this.platform.is('ios') ? 'md-create' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalAnotacionPage, { 'reserva': reserva });
            modal.present();
          }
        }, {
          text: 'Anular reserva',
          icon: !this.platform.is('ios') ? 'md-remove-circle' : null,
          handler: () => {
            this.mostrarConfirmacion(reserva.id);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'md-close' : null,
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  mostrarConfirmacion(id) {
    let confirm = this.alertCtrl.create({
      title: 'Anular',
      message: '¿Desea anular la reserva?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.eliminarReserva(id)
          }
        },
        {
          text: 'No',
          handler: () => {
          }
        }
      ]
    });
    confirm.present();
  }

  limpiar() {
    this.buscador = "";
    this.getItems();
  }
}
