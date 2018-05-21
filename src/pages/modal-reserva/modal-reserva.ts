import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { Reserva } from '../../modelo/reserva';
import { Usuario } from '../../modelo/usuario';
import { Curso } from '../../modelo/curso';
import { ReservaProvider } from '../../providers/reserva/reserva';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider
  ) {
    this.recurso = navParams.get('recurso');
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
    console.log(this.reserva);
  }

  selectCurso(event) {
    console.log(event);
    let curso = this.usuario.cursos.filter((curso: Curso) => curso.id === event);
    this.reserva.curso = curso[0];
  }

  getHorasDisponibles() {
    let fecha = this.reserva.fechas_reservas[0].split("-");
    this.reserva.fechas_reservas[0] = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
    this._reservaService.getHorasDisponibles(this.reserva.fechas_reservas[0], this.recurso.id).subscribe(
      (response: any) => {
        this.horasDisponibles = response;
        console.log(this.horasDisponibles);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
