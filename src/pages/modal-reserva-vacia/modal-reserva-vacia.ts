import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { Reserva } from '../../modelo/reserva';
import { Usuario } from '../../modelo/usuario';
import { Curso } from '../../modelo/curso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModalReservaVaciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-reserva-vacia',
  templateUrl: 'modal-reserva-vacia.html',
})
export class ModalReservaVaciaPage {
  public reserva: Reserva;
  public usuario: Usuario;
  public doingReserva: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App) {
    this.reserva = navParams.get('reserva');
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalReservaVaciaPage');
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
    this.reserva.usuario = this.usuario;
    this.reserva.id = "";
    this.doingReserva = true;
    this.selectCurso(this.reserva.curso);
    console.log(this.reserva);
    this._reservaService.addReserva(this.reserva).subscribe(
      (response: any) => {
        console.log(response)
        this.mostrarMensajeCorrecto();
        this.dismiss();
        this.doingReserva = false;
      },
      (error: any) => {
        if (error.status === 403) {
          localStorage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        } else if (error.status === 409) {
          this.mostrarMensajeConflicto()
          this.doingReserva = false;
        }else if (error.status === 302) {
          this.mostrarMensajeUsuarioOcupado()
          this.doingReserva = false;
        } else {
          this.mostrarMensajeIncorrecto();
        }
        this.doingReserva = false;
      }
    );
  }
  /**
   * Seleccionar un curso
   * @param idCurso String id curso
   */
  selectCurso(idCurso) {
    console.log(event);
    let curso = this.usuario.cursos.filter((curso: Curso) => curso.id === idCurso);
    this.reserva.curso = curso[0];
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
   * Mostrar mensaje operacion realizada con existo
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva realizada correctamente',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje conflicto en la reserva
   */
  mostrarMensajeConflicto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva ocupada por otro usuario',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje de error al realziar la reserva porque ya existe para otro aula
   */
  mostrarMensajeUsuarioOcupado() {
    let toast = this.toastCtrl.create({
      message: 'Fecha y hora ya reservadas para otro aula',
      duration: 3000
    });
    toast.present();
  }
}
