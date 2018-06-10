import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App, ToastController } from 'ionic-angular';
import { Reserva } from '../../modelo/reserva';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModalAnotacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-anotacion',
  templateUrl: 'modal-anotacion.html',
})
export class ModalAnotacionPage {

  public reserva: Reserva;
  public horasDisponibles: string[];
  public fecha: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App
  ) {

    this.reserva = this.navParams.get("reserva");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalReservaPage');
  }
  /**
   * Cerrar ventana
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  /**
   * Guardar reserva
   */
  realizarReserva() {

    console.log(this.reserva);
    this._reservaService.addReserva(this.reserva).subscribe(
      (response: any) => {
        console.log(response)
        this.mostrarMensajeCorrecto();
        this.dismiss();
      },
      (error: any) => {
        if (error.status === 403) {
          localStorage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
        }
      }
    );
  }
  /**
   * Mostrar mensaje error en la operacion
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al realizar la reserva',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje operacion realizada
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Anotación guardada',
      duration: 3000
    });
    toast.present();
  }

}
