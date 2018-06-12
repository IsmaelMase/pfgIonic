import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { Reserva } from '../../modelo/reserva';
import { Usuario } from '../../modelo/usuario';
import { Curso } from '../../modelo/curso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { LoginPage } from '../login/login';
import * as moment from 'moment';

/**
 * Generated class for the ModalReservaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-reserva',
  templateUrl: 'modal-reserva.html',
})
export class ModalReservaPage {

  public recurso: Recurso;
  public reserva: Reserva;
  public usuario: Usuario;
  public horasDisponibles: string[];
  public doingReserva: boolean = false;
  public maxDate;
  public minDate;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App) {
    this.recurso = navParams.get('recurso');
    this.maxDate = moment(this.recurso.intervalo.fecha_max).format("YYYY-MM-DD");
    this.minDate = moment().format("YYYY-MM-DD");
    console.log(moment(this.recurso.intervalo.fecha_max).format("YYYY-MM-DD"));
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.reserva = new Reserva("", [], [], this.usuario, this.recurso, null, "");
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
   * Realizar reserva
   */
  realizarReserva() {
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
        } else if (error.status === 302) {
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
   * Seleccionar curso
   * @param idCurso String idCurso
   */
  selectCurso(idCurso) {
    console.log(event);
    let curso = this.usuario.cursos.filter((curso: Curso) => curso.id === idCurso);
    this.reserva.curso = curso[0];
  }
  /**
   * Obtener horas diponibles
   */
  getHorasDisponibles() {
    if (moment(this.reserva.fechas_reservas[0]).day() === 0 || moment(this.reserva.fechas_reservas[0]).day() === 6) {
      this.mostrarMensajeIncorrectoFecha();
    } else {
      this.reserva.fechas_reservas[0] = moment(this.reserva.fechas_reservas[0]).format("YYYY/MM/DD")
      this._reservaService.getHorasDisponibles(this.reserva.fechas_reservas[0], this.recurso.id).subscribe(
        (response: any) => {

          this.horasDisponibles = response;
          console.log(this.horasDisponibles);
        },
        (error: any) => {
          if (error.status == 403) {
            localStorage.clear();
            this.app.getRootNav().setRoot(LoginPage);
          } else {
            this.mostrarMensajeIncorrecto();
          }
          console.log(error);
        }
      );
    }
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
   * Mostrar mensaje de error al realziar la reserva porque ya existe para otro aula
   */
  mostrarMensajeUsuarioOcupado() {
    let toast = this.toastCtrl.create({
      message: 'Fecha y hora ya reservadas para otro aula',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje error en la fecha
   */
  mostrarMensajeIncorrectoFecha() {
    let toast = this.toastCtrl.create({
      message: 'Por favor seleccione un día entre Lunes y Viernes',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje operacion realizada
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva realizada correctamente',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje conflicto reserva ya realizada
   */
  mostrarMensajeConflicto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva ocupada por otro usuario',
      duration: 3000
    });
    toast.present();
  }

}
