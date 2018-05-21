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


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    RecursosPage,
    ReservasPage,
    PerfilPage,
    ModalReservaPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
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
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginProvider,
    UsuarioProvider,
    RecursoProvider,
    ReservaProvider
  ]
})
export class AppModule { }
