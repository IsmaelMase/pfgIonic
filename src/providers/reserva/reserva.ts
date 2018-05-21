import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { CONSTANTS } from '../../global/constants';


@Injectable()
export class ReservaProvider {
  public url: string;
  constructor(public http: Http) {
    this.url = CONSTANTS.url;
  }


  getHorasDisponibles(fecha: string, id:string){
    let json = JSON.stringify(fecha);
    console.log(json);
    
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', localStorage.getItem("token"));

    return this.http.post(this.url + 'reserva/getHorasNoDisponibles/'+id, json, { headers: headers})

  }
}
