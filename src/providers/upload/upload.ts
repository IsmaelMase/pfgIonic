import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CONSTANTS } from '../../global/constants';

/*
  Generated class for the UploadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadProvider {
  public url: string;
  constructor(public http: Http) {
    this.url = CONSTANTS.url;
  }
  /**
   * Guardar imagen
   * @param formdata Imagen
   */
  saveImage(formdata: FormData) {
    return this.http.post(this.url + 'upload/saveFile', formdata)
  }

}
