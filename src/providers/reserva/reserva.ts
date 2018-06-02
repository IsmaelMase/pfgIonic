import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../global/constants';
import { Reserva } from '../../modelo/reserva';


@Injectable()
export class ReservaProvider {
  public url: string;
  constructor(public http: HttpClient) {
    this.url = CONSTANTS.url;
  }

  getReservasByUsuario(id: string, skip: number, fecha: string) {
    let json = JSON.stringify(fecha);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'reserva/reservasByUsuario/' + id + "/" + skip, json, { headers: headers });
  }

  getReservasByRecurso(id: string, skip: number, fecha: string) {
    let json = JSON.stringify(fecha);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'reserva/reservasByRecurso/' + id + "/" + skip, json, { headers: headers });
  }

  getHorasDisponibles(fecha: string, id: string) {
    let json = JSON.stringify(fecha);
    console.log(json);

    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.post(this.url + 'reserva/getHorasNoDisponibles/' + id, json, { headers: headers });

  }

  addReserva(reserva: Reserva) {
    let json = JSON.stringify(reserva);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.post(this.url + 'reserva/saveReserva', json, { headers: headers })

  }

  removeReserva(id: String) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.delete(this.url + 'reserva/removeReserva/' + id, { headers: headers })

  }
}
