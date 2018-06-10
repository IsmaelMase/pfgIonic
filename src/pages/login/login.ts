import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { LoginProvider } from '../../providers/login/login';
import { TabsPage } from '../tabs/tabs';
import { UserChangePass } from '../../modelo/userChangePass';

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
  public userChangePass: UserChangePass;
  constructor(public _loginService: LoginProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, private fb: FormBuilder) {
    //validacion de formulario
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem("token")) {
      this.navCtrl.setRoot(TabsPage);
    }
    this.userChangePass = new UserChangePass("", "", "");
    this.usuario = new Usuario("", "", "", "", "", "", "", [], "", "");
  }
  /**
   * Metodo cuando se incia la vista
   */
  ionViewDidLoad() {
    if (localStorage.getItem("token")) {
      this.navCtrl.setRoot(TabsPage);
    }
    console.log('ionViewDidLoad LoginPage');
  }
  /**
   * Metodo para loguearse en la aplicacion
   */
  conectar() {
    this.usuario.password = btoa(this.password);
    this._loginService.login(this.usuario).subscribe(
      (response: any) => {
        console.log(response.authorization);
        if (response.usuario.rol === 'ROL_PROFESOR') {
          localStorage.setItem("token", response.authorization);
          localStorage.setItem("usuario", JSON.stringify(response.usuario))
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.mostrarMensajeIncorrecto();
        }
      },
      (error: any) => {
        console.log(error.status);
        this.mostrarMensajeIncorrecto();
      }
    );
  }
  /**
   * Metodo para generar nueva contraseña y envir peticion para cambiarla
   */
  sendRequest() {
    let password = this.generatePass();
    this.userChangePass.passEncr = btoa(password);
    this.userChangePass.pass = password;
    this._loginService.changePassword(this.userChangePass).subscribe(
      (response: any) => {
        this.operationDone();
      },
      (error: any) => {
        if (error.status === 404) {
          this.usuarioNotFound();
        } else if (error.status === 400) {
          this.operationNotDone();
        } else {
          this.operationNotDone();
        }
      }
    );
  }
  /**
   * Mostrar ventana emergente para introducir email
   */
  showAlertFogetPass() {
    let alert = this.alertCtrl.create({
      title: 'Petición de nueva contraseña',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {

          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            //se comprueba si el email es correcto
            if (data.email.includes("@") && data.email.includes(".")) {
              this.userChangePass.email = data.email;
              this.sendRequest();
            } else {
              this.emailNotValid();
            }
          }
        }
      ]
    });
    alert.present();
  }
  /**
   * Mostrar mensaje erro en la aplicacion
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Usuario o contraseña incorrectos',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje usuario no encontrado
   */
  usuarioNotFound() {
    let toast = this.toastCtrl.create({
      message: 'El email introducido no esta regristrado',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Cambio de contraseña no se ha podido realizar
   */
  operationNotDone() {
    let toast = this.toastCtrl.create({
      message: 'Error en la operación',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Cambio de contrañesa realizado
   */
  operationDone() {
    let toast = this.toastCtrl.create({
      message: 'Contraseña modificada',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Email no valido
   */
  emailNotValid() {
    let toast = this.toastCtrl.create({
      message: 'Email no valido',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Generar contraseña
   */
  generatePass() {
    var chars = "ABCDEFGHIJKLMNOP1234567890";
    var pass = "";
    for (var x = 0; x < 8; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
    }
    return pass;
  }

}
