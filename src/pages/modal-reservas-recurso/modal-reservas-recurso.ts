import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, App, LoadingController } from 'ionic-angular';
import { Recurso } from '../../modelo/recurso';
import { ReservaProvider } from '../../providers/reserva/reserva';
import { Reserva } from '../../modelo/reserva';
import { LoginPage } from '../login/login';
import * as moment from 'moment';
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
    public toastCtrl: ToastController, public app: App, public loadingCtrl: LoadingController
  ) {
    this.recurso = navParams.get('recurso');
    moment.locale('es');
  }

  ionViewDidLoad() {
    this.getWeek();
    this.getReservas(null, null);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getReservas(refresher, infiniteScroll) {
    this.skip = this.skip + 1;
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
        console.log(response.length);
        if (response.length >= 60) {
          this.continue = true
        } else {
          this.continue = false;
        }
        for (let reserva in response) {
          let fechaSeparada = response[reserva].fechas_reservas[0].split("/")
          response[reserva].fechas_reservas[0] = fechaSeparada[2] + "/" + fechaSeparada[1] + "/" + fechaSeparada[0];
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

  getWeek() {
    console.log(moment(this.buscador).day());
    let diaSemana = (moment(this.buscador).day() - 1) * -1;
    if (moment(this.buscador).day() !== 0 && moment(this.buscador).day() !== 6) {
      this.fechasBusqueda = [];
      // let numeroUltimoDia = 4 - (diaSemana * -1);
      let primerDia = moment(this.buscador).add(diaSemana, "days").format("YYYY-MM-DD");
      // let ultimoDia = moment(this.buscador).add(numeroUltimoDia, "days").format("YYYY-MM-DD");
      this.getAllDayWeek(primerDia);
      // this.fechasBusqueda.push(primerDia);
      // this.fechasBusqueda.push(ultimoDia);
      // this.getReservas(null, null);
    } else {
      this.reservasTotales = [];
      this.reservas = [];
    }
  }

  getAllDayWeek(diaInicial) {
    this.fechasArray = [];
    this.fechasArray.push(diaInicial);
    for (let i = 1; i < 5; i++) {
      this.fechasArray.push(moment(diaInicial).add(i, "days").format("YYYY-MM-DD"))
    }

    if (this.slides !== undefined) {
      this.slides.slideTo(0);
      this.fechaMostrar = moment(this.fechasArray[0]).format('dddd  DD MMMM YYYY ');
    } else {
      this.fechaMostrar = moment(this.fechasArray[this.slidePos]).format('dddd  DD MMMM YYYY ');
    }
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
