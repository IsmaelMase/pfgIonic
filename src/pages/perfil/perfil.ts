import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  public usuario: Usuario
  public usuarioForm: FormGroup;

  constructor(public _usuarioService: UsuarioProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder) {
    this.usuarioForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.usuario = new Usuario("", "", "", "", "", "", "", [], "ROL_PROFESOR");
  }

  ionViewDidLoad() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuario.password="";
  }

  saveUsuario() {
    this.usuario.password = btoa(this.usuario.password);
    this._usuarioService.saveUsuario(this.usuario).subscribe(
      (response:any) => {
        console.log(response);
        localStorage.setItem("usuario", JSON.stringify(response));
        this.usuario.password="";
      },
      (error:any) => {
        console.log(error);
        this.mostrarMensajeIncorrecto();
      }
    );
  }

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Error en la operación',
      duration: 3000
    });
    toast.present();
  }

}
