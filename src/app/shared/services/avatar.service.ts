import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

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

    const options = this.utilsService.getOptions();

    return this.http.get(AppConfig.AVATARS_URL + '/' + id, options)
      .map((response: Response, index: number) => Avatar.toObject(response.json()));
  }

  public getAllAvatars(): Observable<Avatar[]> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.AVATARS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => {
        const avatars: Avatar[] = Avatar.toObjectArray(response.json());
        return avatars;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

}
