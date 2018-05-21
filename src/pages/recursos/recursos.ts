import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, ActionSheetController, Platform } from 'ionic-angular';
import { ModalReservaPage } from '../modal-reserva/modal-reserva';
import { RecursoProvider } from '../../providers/recurso/recurso';
import { Recurso } from '../../modelo/recurso';
import { LoginPage } from '../login/login';
/**
 * Generated class for the RecursosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-recursos',
  templateUrl: 'recursos.html',
})
export class RecursosPage {

  public opciones: string;
  public recursos: Recurso[];
  constructor(public _recursoService: RecursoProvider, public navCtrl: NavController, public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController, public platform: Platform,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    this.opciones = "aulas";
    this.cambiarRecursos();
  }

  cambiarRecursos() {
    if (this.opciones === "aulas") {
      this._recursoService.getAulas().subscribe(
        (response: any) => {
          this.recursos = response;
          console.log(this.recursos);
        },
        (error: any) => {
          this.navCtrl.setRoot(LoginPage);
        }
      );
    } else {
      this._recursoService.getOtros().subscribe(
        (response: any) => {
          this.recursos = response;
          console.log(this.recursos);
        },
        (error: any) => {
          this.navCtrl.setRoot(LoginPage);
        }
      );
    }
  }

  abrirMenuOpciones(recurso) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Opciones',
      buttons: [
        {
          text: 'Comunicar Incidencia',
          icon: !this.platform.is('ios') ? 'md-alert' : null,
          handler: () => {
            console.log('Incidencia clicked');
          }
        }, {
          text: 'Reservas',
          icon: !this.platform.is('ios') ? 'md-time' : null,
          handler: () => {
            let modal = this.modalCtrl.create(ModalReservaPage,{'recurso':recurso});
            modal.present();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'md-close' : null,
          handler: () => {
            console.log('Reserva clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  getItems(event){
    console.log(event)
  }

}
