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
    console.log('ionViewDidLoad ModalReservaPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  guardarIncidencia() {
    this._recursoService.addRecurso(this.recurso).subscribe(
      (response: any) => {
        console.log(response)
        this.mostrarMensajeCorrecto();
        this.dismiss();
      },
      (error: any) => {
        console.log(error.status)
        if (error.status === 403) {
          localStorage.clear();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
        }
      }
    );
  }

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al comunicar la incidencia',
      duration: 3000
    });
    toast.present();
  }
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Incidencia comunicada',
      duration: 3000
    });
    toast.present();
  }

}
