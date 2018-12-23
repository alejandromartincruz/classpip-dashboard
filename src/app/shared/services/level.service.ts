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

  public getLevel(points: Number): Number {
    if (points <= 0) {
      points = 1;
    }
    const level = Math.floor(points.valueOf() / 10);
    return level;
  }

  public getRank(points: Number): Rango {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

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

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.RANGE_URL, options)
      .map((response: Response) => Rango.toObjectArray(response.json()));
  }

  public sortFunction(a, b) {
    if (a['puntosRango'] === b['puntosRango']) {
      return 0;
    } else {
      return (a['puntosRango'] < b['puntosRango']) ? -1 : 1;
    }
  }

  public getNextLevelPoints(points: Number): number {
    let nextLevelPoints = Math.ceil(points.valueOf() / 10) * 10;
    if (points.valueOf() === nextLevelPoints) {
      nextLevelPoints = nextLevelPoints + 10;
    }

    return nextLevelPoints;
  }

}
