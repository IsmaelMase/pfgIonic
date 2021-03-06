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
  constructor(public http: HttpClient) {
    this.url = CONSTANTS.url;
  }

  login(usuarioLogin: any) {
    let json = JSON.stringify(usuarioLogin);
    console.log(json);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.url + 'login', json, { headers: headers });

  }

  changePassword(changePassUser: any) {
    let json = JSON.stringify(changePassUser);
    console.log(json);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.url + 'mail/sendMail', json, { headers: headers });

  }

}
