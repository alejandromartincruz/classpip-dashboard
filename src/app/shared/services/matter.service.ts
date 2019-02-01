import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Matter } from '../models/index';

@Injectable()
export class MatterService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * Returns a matter object with all the information from a matter
   * identifier. This method is used to fill all the information
   * of the groups we are querying
   * @return {Matter} matter object with all the information
   */
  public getMatter(id: number): Observable<Matter> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.MATTERS_URL + '/' + id;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Matter.toObject(response.json()));
  }

  public getMatters(): Observable<Matter[]> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.MATTERS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Matter.toObjectArray(response.json()));
  }

  public postMatter(postParams: Matter): Observable<Matter> {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.NEW_MATTER;
    const postData = {
      // tslint:disable-next-line:quotemark
      "id": postParams.id,
      // tslint:disable-next-line:quotemark
      "name": postParams.name,
      // tslint:disable-next-line:quotemark
      "schoolId": postParams.schoolId
    };

    return this.http.post(postUrl, postData, options)
      .map((response: Response) => {
        return Matter.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }
  /*
    public editMatter(patchParams: Matter): Observable<Matter> {

      const options = this.utilsService.getOptions();
      const postUrl = AppConfig.GRADES_URL + '/' + postParams.gradeId + '/matters';
      const patchData = {
        // tslint:disable-next-line:quotemark
        "name": patchParams.name,
      };

      return this.http.patch(postUrl, patchData, options)
        .map((response: Response) => {
          return Matter.toObject(response.json());
        })
        .catch((error: Response) => this.utilsService.handleAPIError(error));
    }
*/
  public deleteMatter(matterId: number): Observable<Matter> {

    const options = this.utilsService.getOptions();
    const deleteUrl = AppConfig.MATTERS_URL + '/' + matterId;

    return this.http.delete(deleteUrl, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
