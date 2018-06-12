import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App, LoadingController, ActionSheetController, AlertController, ModalController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { Reserva } from '../../modelo/reserva';
import { LoginPage } from '../login/login';
import * as moment from 'moment';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ModalReservaVaciaPage } from '../modal-reserva-vacia/modal-reserva-vacia';
/**
 * Generated class for the ModalReservasRecursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-reservas-recurso',
  templateUrl: 'modal-reservas-recurso.html',
})
export class ModalReservasRecursoPage {
  @ViewChild(Slides) slides: Slides;

  public buscador: any = moment().format("YYYY-MM-DD");
  public fechasBusqueda: string[];
  public fechasArray: string[] = [];
  public recurso: Recurso
  public reservas: Reserva[] = [];
  public reservasTotales: Reserva[] = [];
  public continue: boolean = true;
  public minDate = moment().format("YYYY-MM-DD");
  public maxDate = moment().add(2, 'years').format("YYYY-MM-DD");
  public slidePos: number = 0;
  public fechaMostrar: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public _reservaService: ReservaProvider,
    public toastCtrl: ToastController, public app: App, public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public modalCtrl: ModalController
  ) {
    this.recurso = navParams.get('recurso');
    this.maxDate = moment(this.recurso.intervalo.fecha_max).format("YYYY-MM-DD");
    this.minDate = moment().format("YYYY-MM-DD");
    moment.locale('es');
  }

  ionViewDidLoad() {
    this.getWeek();
  }
  /**
   * Cerrar ventana
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }
  /**
   * Obtener reservas por fecha y recurso
   * @param refresher Refresh elemento para cuando se realiza el refresco de listado
   * @param infiniteScroll InfiniteScroll elemento para cuando se llega al final de la lista
   */
  getReservas(refresher, infiniteScroll) {
    this.reservas = [];
    this.reservasTotales = [];
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Cargando. Espere por favor'
    });

    loading.present();

    this._reservaService.getReservasByRecurso(this.recurso.id, this.fechasArray[this.slidePos]).subscribe(
      (response: any) => {
        console.log(response);
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
        if (error.status == 403) {
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
          if (refresher != null) {
            refresher.complete();
          }
          if (infiniteScroll != null) {
            infiniteScroll.complete();
          }

          loading.dismiss();
          this.mostrarMensajeIncorrecto();
        }
        console.log(error);
      }
    );
  }
  /**
   * Mostrar mensaje error en la operacion
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener reservas',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Inicializar variables
   */
  limpiar() {
    console.log(this.buscador);
    this.reservas = [];
    this.reservasTotales = [];
    this.getReservas(null, null);
  }
  /**
   * Metodo para inicializar variables cunado se selecciona una fecha
   */
  seleccionarFecha() {
    console.log(this.buscador);
    this.fechasArray = [];
    this.getWeek();
  }
  /**
   * Mostrar anotacion de reserva
   * @param reserva Reserva
   */
  mostrarAnotacionReserva(reserva: Reserva) {
    const alert = this.alertCtrl.create({
      title: 'Anotación',
      message: reserva.anotacion,
      buttons: ['Cerrar']
    });
    alert.present();

  }
  /**
   * Abrir ventana para la realizacion de una reserva
   * @param reserva Reserva
   */
  abrirVentanaReserva(reserva) {
    let modal = this.modalCtrl.create(ModalReservaVaciaPage, { 'reserva': reserva });
    modal.onDidDismiss(data => {
      this.getReservas(null, null);
    });
    modal.present();
  }
  /**
   * Obtener dias de una semana donde se encuentre la fecha indicada
   */
  getWeek() {
    console.log(moment(this.buscador).day());
    let diaSemana;
    if (moment(this.buscador).day() !== 0 && moment(this.buscador).day() !== 6) {
      diaSemana = (moment(this.buscador).day() - 1) * -1;
    } else {
      if (moment(this.buscador).day() === 0) {
        diaSemana = -6;
      } else {
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
   * Obtener dias de las semana segun la fecha y guardar en array y controlar posicion del slider
   * @param diaInicial String primer dia de la semana
   */
  getAllDayWeek(diaInicial) {
    this.fechasArray = [];
    this.fechasArray.push(diaInicial);
    for (let i = 1; i < 5; i++) {
      this.fechasArray.push(moment(diaInicial).add(i, "days").format("YYYY-MM-DD"))
    }
    console.log(this.fechasArray)

    if (this.slides !== undefined) {
      let pos = this.fechasArray.indexOf(moment(this.buscador).format("YYYY-MM-DD"))
      if (pos === -1) {
        this.slides.slideTo(4);
      } else {
        this.slides.slideTo(pos);
      }
    } else {
      let pos = this.fechasArray.indexOf(moment(this.buscador).format("YYYY-MM-DD"))
      if (pos === -1) {
        this.slidePos = 4;
      } else {
        this.slidePos = pos;
      }
    }
    if(this.slidePos===0){
      this.getReservas(null,null);
    }
    this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
  }
  /**
   * Metodo para refresca las variables cuando se cambia de fecha en el slider
   */
  getFechaSlider() {
    this.slidePos = this.slides.getActiveIndex()
    if (this.slidePos !== 5) {
      this.reservas = [];
      this.reservasTotales = [];
      console.log(this.slidePos);
      this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
      this.getReservas(null, null);
    }
  }
}
