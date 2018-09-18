import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import { AppConfig } from '../../app.config';

import { UtilsService } from './utils.service';
import { AvatarService } from './avatar.service';
import { Profile, Role, Avatar, Student } from '../models/index';

@Injectable()
export class UserService {

  constructor(
    public http: Http,
    public avatarService: AvatarService,
    public utilsService: UtilsService) { }

  /**
   * This method returns the profile information of the current logged
   * in user on the platform
   * @return {Observable<Profile>} returns an observable with the profile
   */
  public getMyProfile(): Observable<Profile> {

    return Observable.create(observer => {
      this.getProfile().subscribe(
        profile => {
          this.avatarService.getAvatar(profile.avatarId).subscribe(
            avatar => {
              profile.avatar = avatar;
              observer.next(profile);
              observer.complete();
            }, error => observer.error(error));
        }, error => observer.error(error));
    });
  }

  /**
   * This method returns the profile information of the current logged
   * in user on the platform
   * @return {Observable<Profile>} returns an observable with the profile
   */
  private getProfile(): Observable<Profile> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl();

    return this.http.get(url, options)
      .map((response: Response, index: number) => Profile.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public getStudentName(id: number): Observable<Student> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl();

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public getStudentName2(id: number): Observable<Student> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl();


    return this.http.get(AppConfig.STUDENT_URL + '/' + id, options)
      .map((response: Response, index: number) => Student.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }
}
