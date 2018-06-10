import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../global/constants';

@Injectable()
export class UsuarioProvider {

  public url: string;
  constructor(public http: HttpClient) {
    this.url = CONSTANTS.url;
  }
  /**
   * Guardar usuario
   * @param usuario Usuario
   */
  saveUsuario(usuario) {
    let json = JSON.stringify(usuario);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers.append('Authorization', localStorage.getItem("token"));

    return this.http.post(this.url + 'usuario/saveUsuario', json, { headers: headers });

  }

}
