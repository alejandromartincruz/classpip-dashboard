import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Grade } from '../models/index';
import { MatterGradeRel } from '../models/matterGradeRel';

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

    const options = this.utilsService.getOptions();
    const url = AppConfig.GRADES_URL + '/' + id;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Grade.toObject(response.json()));
  }

  public getGradesWithMatters(schoolId: number): Observable<Grade[]> {
    const options = this.utilsService.getOptions();
    const filter = '?filter=%7B%22include%22%3A%5B%22matters%22%5D%2C%20%22where%22%3A%20%7B%22schoolId%22%3A' + schoolId + '%7D%7D';
    const url = AppConfig.GRADES_URL;

    return this.http.get(url + filter, options)
      .map((response: Response, index: number) => Grade.toObjectArray(response.json()));

  }

  public postGrade(postParams: Grade): Observable<Grade> {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.GRADES_URL;
    const postData = {
      // tslint:disable-next-line:quotemark
      "name": postParams.name,
      // tslint:disable-next-line:quotemark
      "schoolId": postParams.schoolId
    };

    return this.http.post(postUrl, postData, options)
      .map((response: Response) => {
        return Grade.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

  public editGrade(patchParams: Grade): Observable<Grade> {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.GRADES_URL + '/' + patchParams.id;
    const patchData = {
      // tslint:disable-next-line:quotemark
      "name": patchParams.name,
    };

    return this.http.put(postUrl, patchData, options)
      .map((response: Response) => {
        return Grade.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteGrade(gradeId: number): Observable<Grade> {

    const options = this.utilsService.getOptions();
    const deleteUrl = AppConfig.GRADES_URL + '/' + gradeId;

    return this.http.delete(deleteUrl, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public saveGradeMatterRel(gradeId: number, matterId: number): Observable<MatterGradeRel> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GRADES_URL + '/' + gradeId + '/matters/rel/' + matterId;

    return this.http.put(url, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteRel(gradeId: number, matterId: number): Observable<Response> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GRADES_URL + '/' + gradeId + '/matters/rel/' + matterId;

    return this.http.delete(url, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

}
