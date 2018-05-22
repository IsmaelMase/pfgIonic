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

  getOtros() {
    let headers = new HttpHeaders({ 'Authorization': localStorage.getItem("token") });

    return this.http.get(this.url + 'recurso/otros', { headers: headers })
  }

  getAulas() {
    let headers = new HttpHeaders({ 'Authorization': localStorage.getItem("token") });

    return this.http.get(this.url + 'recurso/aulas', { headers: headers })
  }

  addRecurso(recurso: Recurso) {
    let json = JSON.stringify(recurso);
    let head = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'recurso/saveRecurso', json, { headers: head });

  }

}
