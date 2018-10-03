import { Injectable } from '@angular/core';
import { Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Router } from '@angular/router';

import { AppConfig } from '../../app.config';
import { Error, Login, Role, School } from '../models/index';
import {Mesa} from '../models/mesa';

@Injectable()
export class UtilsService {

  private _role: Role;
  private _currentUser: Login;
  private _currentSchool: School;

  constructor(
    public translateService: TranslateService,
    public router: Router) { }

  /**
   * This method construct the current user url depending on the role
   * of the user
   * @returns {string} generated url
   */
  public getMyUrl(): string {
    let url: string;
    switch (this.role) {
      case Role.STUDENT:
        url = AppConfig.STUDENT_URL + '/' + this.currentUser.userId;
        break;
      case Role.TEACHER:
        url = AppConfig.TEACHER_URL + '/' + this.currentUser.userId;
        break;
      case Role.SCHOOLADMIN:
        url = AppConfig.SCHOOLADMIN_URL + '/' + this.currentUser.userId;
        break;
      default:
        break;
    }
    return url;
  }

  /**
   * This method construct the current user url depending on the role
   * of the user
   * @returns {string} generated url
   */
  public getMySchoolUrl(): string {
    return AppConfig.SCHOOL_URL + '/' + this.currentSchool.id;
  }

  /**
   * This method appends the authorization header to the request
   * @param {Headers} headers Headers object to fill with the Authorization token
   * @return {Headers} Returns the headers object
   */
  public setAuthorizationHeader(headers: Headers, idUser: string): Headers {
    headers.append(AppConfig.AUTH_HEADER, idUser);
    return headers;
  }

  /**
   * This method handles the bad responses of the backend
   * @param {Response} response Object with the server response
   * @return {Observable<Response>} Response with the error message
   */
  /* tslint:disable */
  public handleAPIError(response: Response): Observable<any> {
    /* tslint:enable */

    let message = '';
    const error: Error = Error.toObject(response.json().error);
    console.error(error);

    switch (error.status) {
      case 401:
        if (error.code === AppConfig.LOGIN_FAILED) {
          message = this.translateService.instant('ERROR.LOGIN_FAILED');
        } else if (error.code === AppConfig.LOGIN_FAILED_EMAIL_NOT_VERIFIED) {
          message = this.translateService.instant('ERROR.LOGIN_FAILED_EMAIL_NOT_VERIFIED');
        } else {
          // Unauthorized request (login again)
          message = this.translateService.instant('ERROR.LOGIN_FAILED');
          this.router.navigate(['/login']);
        }
        break;
      case 500:
        message = this.translateService.instant('ERROR.INTERNAL_ERROR') + error.message;
        break;
      default:
        if (error.message) {
          message = error.message;
        } else {
          message = this.translateService.instant('ERROR.INTERNAL_ERROR');
        }
        break;
    }
    return Observable.throw(message);
  }

  /**
   * Getters and Setters
   * --------------------------------------------------------------------------
   */

  public get role(): Role {
    return this._role;
  }

  public set role(value: Role) {
    this._role = value;
  }

  public get currentUser(): Login {
    return this._currentUser;
  }

  public set currentUser(value: Login) {
    this._currentUser = value;
  }

  public get currentSchool(): School {
    return this._currentSchool;
  }

  public set currentSchool(value: School) {
    this._currentSchool = value;
  }

}
