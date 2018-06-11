import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, AlertController } from 'ionic-angular';
import { Usuario } from '../../modelo/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { Camera } from '@ionic-native/camera';
import { UploadProvider } from '../../providers/upload/upload';
import { File, FileEntry } from '@ionic-native/file';
import { CONSTANTS } from '../../global/constants';

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
  public url = CONSTANTS.url;
  constructor(public _usuarioService: UsuarioProvider, public toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams,
    private fb: FormBuilder, public app: App, public alertCtrl: AlertController, private camera: Camera, private uploadService: UploadProvider, private file: File) {
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
  /**
   * Resolver ruta de la imagen para obtenerla
   * @param imageFileUri  String ruta imagen
   */
  uploadPhoto(imageFileUri: any): void {
    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }
  /**
   * Leer la imagen
   * @param file Imagen
   */
  readFile(file: any) {
    let reader = new FileReader();
    reader.onloadend = () => {
      this.formData = new FormData();
      let imgBlob = new Blob([reader.result], { type: file.type });
      this.formData.append('file', imgBlob, file.name);
      this.nombreImagen = file.name;
    };
    reader.readAsArrayBuffer(file);
  }
  /**
   * Subir imagen a la api
   */
  upload() {
    if (this.formData !== undefined) {
      this.uploadService.saveImage(this.formData).subscribe(
        (response: any) => {
          console.log("RESPONSE" + response);
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
    if (this.nombreImagen !== undefined) {
      this.usuario.imagen = this.nombreImagen;
    }
    console.log(this.usuario.password);
    this._usuarioService.saveUsuario(this.usuario).subscribe(
      (response: any) => {
        console.log("RESPONSEEE" + JSON.stringify(response));
        this.mostrarMensajeCorrecto();
        localStorage.setItem("usuario", JSON.stringify(response));
        this.usuario = response;
        console.log(this.usuario);
        this.formData = undefined;
      },
      (error: any) => {
        if (error.status === 403) {
          this.logout();
          this.app.getRootNav().setRoot(LoginPage);
        } else if (error.status === 409) {
          this.usuario.dni = JSON.parse(localStorage.getItem("usuario")).dni;
          this.mostrarMensajeDuplicado("NIF");
        } else if (error.status === 406) {
          this.usuario.email = JSON.parse(localStorage.getItem("usuario")).email;
          this.mostrarMensajeDuplicado("Email");
        } else {
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            //se comprueba que la contraseña sea correcta
            if (data.pass !== "") {
              console.log(data.pass);
              this.usuario.password = btoa(data.pass);
              console.log(this.usuario.password);

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
