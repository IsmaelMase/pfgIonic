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

  dismiss() {
    this.viewCtrl.dismiss();
  }

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
        } else {
          this.mostrarMensajeIncorrecto();
        }
        this.doingReserva = false;
      }
    );
  }

  selectCurso(idCurso) {
    console.log(event);
    let curso = this.usuario.cursos.filter((curso: Curso) => curso.id === idCurso);
    this.reserva.curso = curso[0];
  }

  getHorasDisponibles() {
    let fecha = this.reserva.fechas_reservas[0].split("-");
    this.reserva.fechas_reservas[0] = fecha[0] + "/" + fecha[1] + "/" + fecha[2];
    let fechaSeleccionada = fecha[0] + "/" + fecha[1] + "/" + fecha[2];
    this._reservaService.getHorasDisponibles(fechaSeleccionada, this.recurso.id).subscribe(
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

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al realizar la reserva',
      duration: 3000
    });
    toast.present();
  }
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva realizada correctamente',
      duration: 3000
    });
    toast.present();
  }

  mostrarMensajeConflicto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva ocupada por otro usuario',
      duration: 3000
    });
    toast.present();
  }

}
