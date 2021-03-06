import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { DatePicker } from '@ionic-native/date-picker';
import { HttpModule } from '@angular/http';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { RecursosPage } from '../pages/recursos/recursos';
import { ReservasPage } from '../pages/reservas/reservas';
import { PerfilPage } from '../pages/perfil/perfil';
import { ModalReservaPage } from '../pages/modal-reserva/modal-reserva';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginProvider } from '../providers/login/login';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { RecursoProvider } from '../providers/recurso/recurso';
import { ReservaProvider } from '../providers/reserva/reserva';
import { ModalIncidenciaPage } from '../pages/modal-incidencia/modal-incidencia';
import { ModalReservasRecursoPage } from '../pages/modal-reservas-recurso/modal-reservas-recurso';
import { ModalAnotacionPage } from '../pages/modal-anotacion/modal-anotacion';
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { UploadProvider } from '../providers/upload/upload';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    RecursosPage,
    ReservasPage,
    PerfilPage,
    ModalReservaPage,
    LoginPage,
    ModalIncidenciaPage,
    ModalReservasRecursoPage,
    ModalAnotacionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthShortNames: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayShortNames: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb" ],
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    RecursosPage,
    ReservasPage,
    PerfilPage,
    ModalReservaPage,
    LoginPage,
    ModalIncidenciaPage,
    ModalReservasRecursoPage,
    ModalAnotacionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    UsuarioProvider,
    RecursoProvider,
    ReservaProvider,
    Camera,
    UploadProvider,
    File
  ]
})
export class AppModule { }
