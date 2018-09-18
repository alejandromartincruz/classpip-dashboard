import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Avatar } from '../models/index';

@Injectable()
export class AvatarService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * Returns a avatar object with all the information from a avatar
   * identifier.
   * @return {Avatar} avatar object with all the information
   */
  public getAvatar(id: number): Observable<Avatar> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.AVATARS_URL + '/' + id, options)
      .map((response: Response, index: number) => Avatar.toObject(response.json()));
  }

}
