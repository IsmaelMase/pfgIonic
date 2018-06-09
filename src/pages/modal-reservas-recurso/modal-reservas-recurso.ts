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
  public skip: number = -1;
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
    moment.locale('es');
  }

  ionViewDidLoad() {
    this.getWeek();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getReservas(refresher, infiniteScroll) {
    this.skip = this.skip + 1;
    this.reservas = [];
    this.reservasTotales = [];
    if (refresher != null) {
      this.reservas = [];
      this.reservasTotales = [];
      this.skip = 0;
    }
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Cargando. Espere por favor'
    });

    loading.present();

    this._reservaService.getReservasByRecurso(this.recurso.id, this.skip, this.fechasArray[this.slidePos]).subscribe(
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
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Fallo al obtener reservas',
      duration: 3000
    });
    toast.present();
  }

  // getItems() {
  //   let fechaSeleccionada;
  //   if (this.buscador !== "") {
  //     let fecha = this.buscador.split("-");
  //     fechaSeleccionada = fecha[2] + "/" + fecha[1] + "/" + fecha[0];
  //     this.reservas = this.reservasTotales.filter((reserva: Reserva) => reserva.fechas_reservas[0] === fechaSeleccionada);
  //   } else {
  //     this.reservas=[...this.reservasTotales];
  //   }

  // }

  limpiar() {
    this.skip = -1;
    console.log(this.buscador);
    this.reservas = [];
    this.reservasTotales = [];
    this.getReservas(null, null);
  }
  seleccionarFecha() {
    this.skip = -1;
    console.log(this.buscador);
    this.reservas = [];
    this.reservasTotales = [];
    this.fechasArray = [];
    this.getWeek();
  }

  mostrarAnotacionReserva(reserva: Reserva) {
    const alert = this.alertCtrl.create({
      title: 'Anotación',
      subTitle: reserva.anotacion,
      buttons: ['Cerrar']
    });
    alert.present();

  }

  abrirVentanaReserva(reserva) {
    let modal = this.modalCtrl.create(ModalReservaVaciaPage, { 'reserva': reserva });
    modal.onDidDismiss(data => {
      this.getReservas(null, null);
    });
    modal.present();
  }

  getWeek() {
    console.log(moment(this.buscador).day());
    let diaSemana;
    if (moment(this.buscador).day() !== 0) {
      diaSemana = (moment(this.buscador).day() - 1) * -1;
    } else {
      diaSemana = -6;
    }
    console.log(diaSemana);
    let primerDia;
    this.fechasBusqueda = [];
    primerDia = moment(this.buscador).add(diaSemana, "days").format("YYYY-MM-DD");
    this.getAllDayWeek(primerDia);
  }

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
    this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
    this.getReservas(null, null);
  }

  getFechaSlider() {
    this.slidePos = this.slides.getActiveIndex()
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
