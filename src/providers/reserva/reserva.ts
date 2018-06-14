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
  /**
   * Devuelve las reservas de un usuario y una fecha
   * @param id String id usuario
   * @param skip number pagina del paginado
   * @param fecha String fecha
   */
  getReservasByUsuario(id: string, skip: number, fecha: string) {
    let json = JSON.stringify(fecha);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'reserva/reservasByUsuario/' + id + "/" + skip, json, { headers: headers });
  }
  /**
   * Devuelve las reservas de un recurso por fecha
   * @param id String id recurso
   * @param fecha String fecha
   */
  getReservasByRecurso(id: string, fecha: string) {
    let json = JSON.stringify(fecha);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });
    return this.http.post(this.url + 'reserva/reservasByRecurso/' + id, json, { headers: headers });
  }
  /**
   * Devuelv horas libres para un recurso y una fecha
   * @param fecha String fecha
   * @param id String id recurso
   */
  getHorasDisponibles(fecha: string, id: string) {
    let json = JSON.stringify(fecha);

    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.post(this.url + 'reserva/getHorasNoDisponibles/' + id, json, { headers: headers });

  }
  /**
   * Guardar reservas
   * @param reserva Reserva
   */
  addReserva(reserva: Reserva) {
    let json = JSON.stringify(reserva);
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.post(this.url + 'reserva/saveReserva', json, { headers: headers })

  }
  /**
   * Borrar reserva
   * @param id String id reserva
   */
  removeReserva(id: String) {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token") });

    return this.http.delete(this.url + 'reserva/removeReserva/' + id, { headers: headers })

  }
}
