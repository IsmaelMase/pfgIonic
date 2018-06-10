import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../global/constants';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {

  public url: string;
  /**
   * Contructor parametrizado
   * @param _http Http
   */
  constructor(public http: HttpClient) {
    this.url = CONSTANTS.url;
  }
  /**
   * Metodo envia peticion de login
   * @param usuarioLogin Datos de usuario
   */
  login(usuarioLogin: any) {
    let json = JSON.stringify(usuarioLogin);
    console.log(json);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.url + 'login', json, { headers: headers });

  }
  /**
   * Peticion cambio de contraseña
   * @param changePassUser Datos usuario
   */
  changePassword(changePassUser: any) {
    let json = JSON.stringify(changePassUser);
    console.log(json);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.url + 'mail/sendMail', json, { headers: headers });

  }

}
