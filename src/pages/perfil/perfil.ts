import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { UploadProvider } from '../../providers/upload/upload';
import { File, FileEntry } from '@ionic-native/file';

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
  public foto: any;
  public formData: FormData;
  public nombreImagen: string;
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

  ionViewDidLoad() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuario.password = "";
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
    }).then(imageData => {
      this.foto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      console.log(error);
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    let reader = new FileReader();
    reader.onloadend = () => {
      this.formData = new FormData();
      let imgBlob = new Blob([reader.result], { type: file.type });
      this.formData.append('file', imgBlob, file.name);
      this.nombreImagen = file.name;
    };
    reader.readAsArrayBuffer(file);
  }

  upload() {
    if (this.formData !== undefined) {
      this.uploadService.saveImage(this.formData).subscribe(
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
    } else {
      this.saveUsuario();
    }
  }

  logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot(LoginPage);
  }

  saveUsuario() {
    if (this.nombreImagen !== undefined) {
      this.usuario.imagen = this.nombreImagen;
    }
    this.usuario.password = btoa(this.usuario.password);
    this._usuarioService.saveUsuario(this.usuario).subscribe(
      (response: any) => {
        console.log("RESPONSEEE" + JSON.stringify(response));
        this.mostrarMensajeCorrecto();
        localStorage.setItem("usuario", JSON.stringify(response));
        this.usuario = response;
        this.usuario.password = "";
        this.formData = undefined;
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
