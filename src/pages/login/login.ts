import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { LoginProvider } from '../../providers/login/login';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  public usuario: Usuario;
  public password: string;
  constructor(public _loginService: LoginProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem("token")) {
      this.navCtrl.setRoot(TabsPage);
    }
    this.usuario = new Usuario("", "", "", "", "", "", "", [], "");
  }

  ionViewDidLoad() {
    if (localStorage.getItem("token")) {
      this.navCtrl.setRoot(TabsPage);
    }
    console.log('ionViewDidLoad LoginPage');
  }
  conectar() {
    this.usuario.password = btoa(this.password);
    this._loginService.login(this.usuario).subscribe(
      (response: any) => {
        console.log(response.authorization);
        localStorage.setItem("token", response.authorization);
        localStorage.setItem("usuario", JSON.stringify(response.usuario))
        this.navCtrl.setRoot(TabsPage);
      },
      (error: any) => {
        console.log(error);
        this.mostrarMensajeIncorrecto();
      }
    );
  }

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Usuario o contraseña incorrectos',
      duration: 3000
    });
    toast.present();
  }


}
