import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../global/constants';
import { Recurso } from '../../modelo/recurso';

/*
  Generated class for the RecursoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RecursoProvider {

  public url: string;
  constructor(public http: HttpClient) {
    this.url = CONSTANTS.url;
  }
  /**
   * Devuelve recursos
   */
  getOtros() {
    let headers = new HttpHeaders({ 'Authorization': localStorage.getItem("token") });

    return this.http.get(this.url + 'recurso/otros', { headers: headers })
  }
  /**
   * Devuelve aulas
   */
  getAulas() {
    let headers = new HttpHeaders({ 'Authorization': localStorage.getItem("token") });

    return this.http.get(this.url + 'recurso/aulas', { headers: headers })
  }
  /**
   * Guardar recurso
   * @param recurso Recurso
   */
  addRecurso(recurso: Recurso) {
    let json = JSON.stringify(recurso);
    let head = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'recurso/saveRecurso', json, { headers: head });

  }

}
