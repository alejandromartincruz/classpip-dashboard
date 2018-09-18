import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Grade } from '../models/index';

@Injectable()
export class GradeService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * Returns a grade object with all the information from a grade
   * identifier. This method is used to fill all the information
   * of the groups we are querying
   * @return {Grade} grade object with all the information
   */
  public getGrade(id: number): Observable<Grade> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.GRADES_URL + '/' + id, options)
      .map((response: Response, index: number) => Grade.toObject(response.json()));
  }

}
