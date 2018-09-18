import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Credentials, Role, Login } from '../models/index';

@Injectable()
export class LoginService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * This method calls the REST API for performing a login against
   * the common services for the application
   * @param {Login} login Object with login credentials
   * @return {Observable<LoginResponse>} observable object with the login response
   */
  public login(credentials: Credentials): Observable<Response> {

    let url: string;
    switch (this.utilsService.role) {
      case Role.STUDENT:
        url = AppConfig.STUDENT_URL + AppConfig.LOGIN_URL;
        break;
      case Role.TEACHER:
        url = AppConfig.TEACHER_URL + AppConfig.LOGIN_URL;
        break;
      case Role.SCHOOLADMIN:
        url = AppConfig.SCHOOLADMIN_URL + AppConfig.LOGIN_URL;
        break;
      default:
        break;
    }

    return this.http.post(url, credentials)
      .map(response => {
        this.utilsService.currentUser = Login.toObject(response.json());
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method executes a logout into the application, removes
   * the current logged user
   * @return {Observable<Boolean>} returns an observable with the result
   * of the operation
   */
  public logout(): Observable<Response> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    let url: string;
    switch (this.utilsService.role) {
      case Role.STUDENT:
        url = AppConfig.STUDENT_URL + AppConfig.LOGOUT_URL;
        break;
      case Role.TEACHER:
        url = AppConfig.TEACHER_URL + AppConfig.LOGOUT_URL;
        break;
      case Role.SCHOOLADMIN:
        url = AppConfig.SCHOOLADMIN_URL + AppConfig.LOGOUT_URL;
        break;
      default:
        break;
    }

    return this.http.post(url, {}, options)
      .map(response => {
        this.utilsService.currentUser = null;
        return true;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
