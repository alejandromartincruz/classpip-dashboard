import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { Rango } from '../models/rango';
import { UtilsService } from './utils.service';

@Injectable()
export class LevelService {

  private rank: Rango;
  private ranks: Array<Rango>;

  constructor(
    public http: Http,
    public utilsService: UtilsService
  ) { }

  public getLevel(points: number): number {
    if (points <= 0) {
      points = 1;
    }
    const level = Math.floor(points / 10);
    return level;
  }

  public getRank(points: number): Rango {

    const options = this.utilsService.getOptions();

    if (points <= 0 || points === undefined) {
      points = 1;
    }

    this.http.get(AppConfig.RANGE_URL, options)
      .map((res: Response) => res.json())
      .subscribe(
        (response) => {
          const max = response.reduce(
            function (i, j) {
              return j.puntosRango <= points ? Math.max(i, j.puntosRango) : i;
            }, Number.MIN_VALUE
          );
          this.rank = response.filter(rango => rango.puntosRango >= max).pop();
        });

    return this.rank;
  }

  public getAllRanks(): Observable<Rango[]> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.RANGE_URL + '?filter[order]=puntosRango%20ASC';

    return this.http.get(url, options)
      .map((response: Response) => Rango.toObjectArray(response.json()));
  }

  public getNextLevelPoints(points: Number): number {
    let nextLevelPoints = Math.ceil(points.valueOf() / 10) * 10;
    if (points.valueOf() === nextLevelPoints) {
      nextLevelPoints = nextLevelPoints + 10;
    }

    return nextLevelPoints;
  }

  public postRank(postParams: Rango): Observable<Rango> {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.RANGE_URL;
    const postData = {
      // tslint:disable-next-line:quotemark
      "nombreRango": postParams.nombreRango,
      // tslint:disable-next-line:quotemark
      "puntosRango": postParams.puntosRango,
      // tslint:disable-next-line:quotemark
      "imageRangoLink": postParams.imageRangoLink,
      // tslint:disable-next-line:quotemark
      "schoolId": postParams.schoolId
    };

    return this.http.post(postUrl, postData, options)
      .map((response: Response) => {
        return Rango.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

  public editRank(patchParams: Rango): Observable<Rango> {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.RANGE_URL + '/' + patchParams.id;
    const patchData = {
      // tslint:disable-next-line:quotemark
      "nombreRango": patchParams.nombreRango,
      // tslint:disable-next-line:quotemark
      "puntosRango": patchParams.puntosRango,
      // tslint:disable-next-line:quotemark
      "imageRangoLink": patchParams.imageRangoLink,
      // tslint:disable-next-line:quotemark
      "schoolId": patchParams.schoolId
    };

    return this.http.put(postUrl, patchData, options)
      .map((response: Response) => {
        return Rango.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteRank(rankId: number): Observable<Rango> {

    const options = this.utilsService.getOptions();
    const deleteUrl = AppConfig.RANGE_URL + '/' + rankId;

    return this.http.delete(deleteUrl, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public sortFunction(a, b) {
    if (a['puntosRango'] === b['puntosRango']) {
      return 0;
    } else {
      return (a['puntosRango'] < b['puntosRango']) ? -1 : 1;
    }
  }

}
