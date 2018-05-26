import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
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

  saveImage(file: any) {
    let formdata: FormData = new FormData();

    formdata.append('file', file);

    return this.http.post(this.url + 'upload/saveFile', formdata)
  }

}
