import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadProvider } from '../../providers/upload/upload';
import { File} from '@ionic-native/file';

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
  public selectedFiles: FileList;
  public currentPhoto: Blob;
  constructor(public _usuarioService: UsuarioProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams,
    private fb: FormBuilder, public app: App, private camera: Camera, private uploadService: UploadProvider, private file: File) {
    this.usuarioForm = this.fb.group({
      dni: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.usuario = new Usuario("", "", "", "", "", "", "", [], "ROL_PROFESOR", "");
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.currentPhoto = this.dataURItoBlob(imageData);
    }, error => {
      error = JSON.stringify(error);
    });
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });
  }



  upload() {

    this.uploadService.saveImage(this.currentPhoto).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status === 200) {
          this.saveUsuario();
        } else if (response.status === 403) {
          this.app.getRootNav().setRoot(LoginPage);
        } else if (response.status === 302) {
          this.saveUsuario();
        } else if (response.status) {
          this.mostrarMensajeIncorrectoImagen();
        }

      },
      error => {
        console.log(error)
      }
    );
  }


  ionViewDidLoad() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuario.password = "";
  }

  logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }

  saveUsuario() {
    this.usuario.password = btoa(this.usuario.password);
    this._usuarioService.saveUsuario(this.usuario).subscribe(
      (response: any) => {
        console.log(response);
        this.mostrarMensajeCorrecto();
        localStorage.setItem("usuario", JSON.stringify(response));
        this.usuario.password = "";
      },
      (error: any) => {
        if (error.status === 403) {
          this.logout();
          this.app.getRootNav().setRoot(LoginPage);
        } else {
          this.mostrarMensajeIncorrecto();
        }
      }
    );
  }

  mostrarMensajeIncorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Datos no guardados',
      duration: 3000
    });
    toast.present();
  }

  mostrarMensajeCorrecto() {
    let toast = this.toastCtrl.create({
      message: 'Datos guardados',
      duration: 3000
    });
    toast.present();
  }

  mostrarMensajeIncorrectoImagen() {
    let toast = this.toastCtrl.create({
      message: 'Error al guardar la imagen',
      duration: 3000
    });
    toast.present();
  }

}
