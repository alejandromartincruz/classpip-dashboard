import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '../../app.config';
import { Rango } from '../models/rango';

@Injectable()
export class LevelService {

  private rank: Rango;

  constructor(public http: Http) { }

  public getLevel(points: Number): Number {
    if (points <= 0) {
      points = 1;
    }
    const level = Math.floor(points.valueOf() / 10);
    return level;
  }

  public getRank(points: Number): Rango {
    if (points <= 0 || points === undefined) {
      points = 1;
    }
    this.http.get(AppConfig.RANGE_URL)
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

  public getNextLevelPoints(points: Number): number {
    let nextLevelPoints = Math.ceil(points.valueOf() / 10) * 10;
    if (points.valueOf() === nextLevelPoints) {
      nextLevelPoints = nextLevelPoints + 10;
    }

    return nextLevelPoints;
  }

}
