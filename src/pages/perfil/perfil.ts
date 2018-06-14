import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, AlertController } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { Camera } from '@ionic-native/camera';
import { CONSTANTS } from '../../global/constants';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  public usuario: Usuario
  public usuarioForm: FormGroup;
  public selectedFiles: FileList;
  public currentPhoto: Blob;
  public foto: any;
  public nombreImagen: string;
  public url = CONSTANTS.url;
  public doingRegistro: boolean;
  constructor(public _usuarioService: UsuarioProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams,
    private fb: FormBuilder, public app: App, public alertCtrl: AlertController, private camera: Camera) {
    this.usuarioForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required]
    });
    this.usuario = new Usuario("", "", "", "", "", "", "", [], "ROL_PROFESOR", "");
  }

  ionViewDidLoad() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }
  /**
   * Seleccionar imagen
   */
  selectPhoto(): void {
    this.doingRegistro = true;

    this.camera.getPicture({
      sourceType: this.camera.MediaType.PICTURE,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.JPEG,
    }).then(imageData => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
      this.doingRegistro = false;
    }, error => {
      this.doingRegistro = false;
    });
  }
  /**
   * Subir imagen a la api
   */
  upload() {
    this.doingRegistro = true;
    if (this.foto !== undefined) {
      let nombre = this.usuario.nombre + Date.now()
      const storageRef = firebase.storage().ref('/usuarios/' + nombre)
      //Tarea realizandose
      storageRef.putString(this.foto, firebase.storage.StringFormat.DATA_URL)
        .then((snapshot) => {
          storageRef.getDownloadURL().then((url) => {
            this.usuario.imagen = url;
            this.saveUsuario();
          }).catch((error) => {
            this.doingRegistro = false;
            this.mostrarMensajeIncorrectoImagen();
          });
        }).catch((error) => {
          this.doingRegistro = false;
          this.mostrarMensajeIncorrectoImagen();
        });
    } else {
      this.saveUsuario();
    }
  }
  /**
   * Cerrar sesion
   */
  logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }
  /**
   * Guardar datos usuario
   */
  saveUsuario() {
    this.foto = undefined;
    this._usuarioService.saveUsuario(this.usuario).subscribe(
      (response: any) => {
        this.mostrarMensajeCorrecto();
        localStorage.setItem("usuario", JSON.stringify(response));
        this.usuario = response;
        this.doingRegistro = false;
      },
      (error: any) => {
        if (error.status === 403) {
          this.logout();
          this.app.getRootNav().setRoot(LoginPage);
        } else if (error.status === 409) {
          this.usuario.dni = JSON.parse(localStorage.getItem("usuario")).dni;
          this.doingRegistro = false;
          this.mostrarMensajeDuplicado("NIF");
        } else if (error.status === 406) {
          this.usuario.email = JSON.parse(localStorage.getItem("usuario")).email;
          this.doingRegistro = false;
          this.mostrarMensajeDuplicado("Email");
        } else {
          this.doingRegistro = false;
          this.mostrarMensajeIncorrecto();
        }
      }
    );
  }
  /**
   * Mostrar mensaje error en al operacion
   */
  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Datos no guardados',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Metodo para mostrar la ventana para el cambio de contraseña
   */
  cambiarPass() {
    const prompt = this.alertCtrl.create({
      title: 'Cambiar Contraseña',
      message: "Para guardar contraseña pulse guardar en el formulario",
      inputs: [
        {
          name: 'pass',
          placeholder: 'Contraseña',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            //se comprueba que la contraseña sea correcta
            if (data.pass !== "") {
              this.usuario.password = btoa(data.pass);

            }
          }
        }
      ]
    });
    prompt.present();
  }
  /**
   * Mostrar mensaje operacion realizada
   */
  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Datos guardados',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar mensaje error en la subida de la imagen
   */
  mostrarMensajeIncorrectoImagen() {
    let toast = this.toastCtrl.create({
      message: 'Error al guardar la imagen',
      duration: 3000
    });
    toast.present();
  }
  /**
   * Mostrar error campo duplicado
   * @param campo String campo
   */
  mostrarMensajeDuplicado(campo: string) {
    let toast = this.toastCtrl.create({
      message: 'El campo ' + campo + ' ya esta registrado',
      duration: 3000
    });
    toast.present();
  }

}
