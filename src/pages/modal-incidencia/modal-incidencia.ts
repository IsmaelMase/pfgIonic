import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { RecursoProvider } from '../../providers/recurso/recurso';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ModalIncidenciaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-incidencia',
  templateUrl: 'modal-incidencia.html',
})
export class ModalIncidenciaPage {
  public recurso: Recurso;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public toastCtrl: ToastController, public app: App,
    public _recursoService: RecursoProvider) {
    this.recurso = navParams.get('recurso');
  }

  ionViewDidLoad() {
  }
  /**
   * Cerrar ventana
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  /**
   * Guardar incidencia
   */
  guardarIncidencia() {
    this._recursoService.addRecurso(this.recurso).subscribe(
      (response: any) => {
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
      message: 'Fallo al comunicar la incidencia',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje operacion realizada
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Incidencia comunicada',
      duration: 3000
    });
    toast.present();
  }

}
