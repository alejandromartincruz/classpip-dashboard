import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {UtilsService} from './utils.service';
import {Observable} from 'rxjs/Observable';
import {Mesa} from '../models/mesa';
import {AppConfig} from '../../app.config';
import {Group} from '../models';


@Injectable()
export class MesaService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  public getMyMesa(): Observable<Mesa> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

     const url: string = this.utilsService.getMyUrl() + AppConfig.MYMESA_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Mesa.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }



}
