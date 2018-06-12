import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App, LoadingController, Platform, ModalController, AlertController, ActionSheetController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { Reserva } from '../../modelo/reserva';
import { LoginPage } from '../login/login';
import * as moment from 'moment';
import { Usuario } from '../../modelo/usuario';
import { ModalAnotacionPage } from '../modal-anotacion/modal-anotacion';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

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
  @ViewChild(Slides) slides: Slides;

  public buscador: any = moment().format("YYYY-MM-DD");
  public fechasBusqueda: string[] = [];
  public fechasArray: string[] = [];
  public recurso: Recurso;
  public usuario: Usuario;
  public reservas: Reserva[] = [];
  public reservasTotales: Reserva[] = [];
  public skip: number = -1;
  public continue: boolean = true;
  public minDate = moment().format("YYYY-MM-DD");
  public maxDate = moment().add(2, 'years').format("YYYY-MM-DD");
  public slidePos: number = 0;
  public fechaMostrar: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App, public loadingCtrl: LoadingController,
    public platform: Platform, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController
  ) {
    this.recurso = navParams.get('recurso');
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    moment.locale('es');
  }

  ionViewDidLoad() {
    this.getWeek();
  }
  /**
   * Eliminar reserva
   * @param id String id reserva
   */
  eliminarReserva(id: string) {
    this._reservaService.removeReserva(id).subscribe(
      (response: any) => {
        this.limpiar();
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
  /**
   * Obtener reservas por fecha y usuario
   * @param refresher Refresh 
   * @param infiniteScroll InfiniteScroll
   */
  getReservas(refresher, infiniteScroll) {
    this.skip = this.skip + 1;
    this.reservas = [];
    this.reservasTotales = [];
    if (refresher != null) {
      this.skip = 0;
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Cargando. Espere por favor'
    });

    loading.present();
    console.log(this.skip);
    this._reservaService.getReservasByUsuario(this.usuario.id, this.skip, this.fechasArray[this.slidePos]).subscribe(
      (response: any) => {
        console.log(response.length);
        if (response.length >= 60) {
          this.continue = true
        } else {
          this.continue = false;
        }
        for (let reserva in response) {
          this.reservasTotales.push(response[reserva]);
        }
        this.reservas = [...this.reservasTotales];
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
          if (refresher != null) {
            refresher.complete();
          }
          if (infiniteScroll != null) {
            infiniteScroll.complete();
          }

          loading.dismiss();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
          if (refresher != null) {
            refresher.complete();
          }
          if (infiniteScroll != null) {
            infiniteScroll.complete();
          }

          loading.dismiss();
        }
        console.log(error);
      }
    );
  }
  /**
   * Mostrar mensaje eliminacion realziada
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Reserva Anulada',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje error en la eliminacion
   */
  mostrarMensajeIncorrectoEliminar() {
    let toast = this.toastCtrl.create({
      message: 'Error al anular la reserva',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje error al recuperar las reservas
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener reservas',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar menu operaciones reserva
   * @param reserva Reserva
   */
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
          text: 'Cancelar',
          role: 'cancel',
          icon: !this.platform.is('ios') ? 'md-close' : null,
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
  /**
   * Mensaje confirmacion borrado reserva
   * @param id String id reserva
   */
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
  /**
   * Inicializar varibales
   */
  limpiar() {
    this.skip = -1;
    console.log(this.buscador);
    this.reservas = [];
    this.reservasTotales = [];
    this.getReservas(null, null);
  }
  /**
   * Metodo para inicializar variables cuando se cambia la fecha
   */
  seleccionarFecha() {
    this.skip = -1;
    console.log(this.buscador);
    this.fechasArray = [];
    this.getWeek();
  }
  /**
   * Obtener primer dia de la semana segun la fecha seleccionada
   */
  getWeek() {
    console.log(moment(this.buscador).day());
    let diaSemana;
    if (moment(this.buscador).day() !== 0 && moment(this.buscador).day() !== 6) {
      diaSemana = (moment(this.buscador).day() - 1) * -1;
    } else {
      if(moment(this.buscador).day() === 0){
        diaSemana = -6;
      }else{
        diaSemana = -5;
      }
    }
    console.log(diaSemana);
    let primerDia;
    this.fechasBusqueda = [];
    primerDia = moment(this.buscador).add(diaSemana, "days").format("YYYY-MM-DD");
    this.getAllDayWeek(primerDia);
  }
  /**
   * Obtener dias de la semana segun una fecha
   * @param diaInicial Stirng primer dia de la semana
   */
  getAllDayWeek(diaInicial) {
    this.fechasArray = [];
    this.fechasArray.push(diaInicial);
    for (let i = 1; i < 5; i++) {
      this.fechasArray.push(moment(diaInicial).add(i, "days").format("YYYY-MM-DD"));
    }
    console.log(this.fechasArray)

    if (this.slides !== undefined) {
      let pos = this.fechasArray.indexOf(moment(this.buscador).format("YYYY-MM-DD"));
      console.log(pos);
      if (pos === -1) {
        this.slides.slideTo(4);
      } else {
        this.slides.slideTo(pos);
      }
    } else {
      let pos = this.fechasArray.indexOf(moment(this.buscador).format("YYYY-MM-DD"));
      console.log(pos);
      if (pos === -1) {
        this.slidePos = 4;
      } else {
        this.slidePos = pos;
      }
    }
    console.log(this.slidePos);
    if(this.slidePos===0){
      this.getReservas(null,null);
    }
    this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
    console.log(this.fechaMostrar);
  }
  /**
   * Obtener fecha cuando se cambia posicion del slider
   */
  getFechaSlider() {
    this.slidePos = this.slides.getActiveIndex();
    console.log("POSICIN"+this.slidePos);
    if (this.slidePos !== 5) {
      this.skip = -1;
      this.reservas = [];
      this.reservasTotales = [];
      console.log(this.slidePos);
      this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
      this.getReservas(null, null);
    }
  }
}
