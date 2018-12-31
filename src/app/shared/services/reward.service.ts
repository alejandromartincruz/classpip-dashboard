import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';

import { Student } from '../models/student';
import { Point } from '../models/point';
import { Reward } from '../models/reward';
import { Rango } from '../models/rango';


@Injectable()
export class RewardService {

  public reward: Reward;
  public ranks: Rango[];
  public rank: Rango;
  public exists: boolean;

  constructor(
    public http: Http,
    public utilsService: UtilsService
  ) { }

  public addPointsProcess(studentId: string, pointId: string, value: number) {
    this.getRanks(studentId, pointId, value);
  }

  public checkIfRewardExists(studentId: string, pointId: string, value: number) {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url = AppConfig.ONLY_REWARDS_URL + '/' + studentId + AppConfig.EXISTS_URL;

    this.http.get(url, options)
      .map((res: Response) => res.json())
      .subscribe(
        (response) => {
          this.exists = response.exists;
          if (this.exists) {
            this.addPoint(studentId, pointId, value);
          } else {
            this.addPointToNewReward(studentId, pointId, value);
          }

        }
      );
  }

  public addPointToNewReward(studentId: string, pointId: string, value: number) {
    this.emptyReward(studentId);
    this.postPointToNewReward(value, pointId);
  }

  public addPoint(studentId: string, pointId: string, value: number) {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url = AppConfig.STUDENT_URL + '/' + studentId + AppConfig.REWARDS_URL;

    this.http.get(url, options)
      .map((res: Response) => res.json())
      .subscribe(
        (reward) => {
          this.reward = reward;
          this.postPoint(value, pointId);
        }
      );

  }

  private emptyReward(studentId: string) {
    this.reward = new Reward;
    this.reward.id = studentId;
    this.reward.points = 0;
    this.reward.level = 0;
    this.reward.next_level_points = 10;
    this.reward.points_obj = JSON.stringify({});
    this.reward.badges_obj = JSON.stringify({});
    this.reward.rank = 'no rank';
  }

  private postPoint(value: number, pointId: string) {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const pointsEarned = this.reward.points + value;
    this.reward.points = pointsEarned;
    this.reward.level = this.getLevel(this.reward.points);
    this.reward.next_level_points = this.getNextLevelPoints(this.reward.points);
    this.reward.points_obj = this.addPointObj(this.reward.points_obj, pointId);
    this.reward.badges_obj = this.addBadgeObj(this.reward.badges_obj, '0');
    this.reward.rank = this.getNewRank(pointsEarned);

    const postParams = {
      // tslint:disable-next-line:quotemark
      "id": this.reward.id,
      // tslint:disable-next-line:quotemark
      "points": this.reward.points,
      // tslint:disable-next-line:quotemark
      "points_obj": this.reward.points_obj,
      // tslint:disable-next-line:quotemark
      "badges_obj": this.reward.badges_obj,
      // tslint:disable-next-line:quotemark
      "level": this.reward.level,
      // tslint:disable-next-line:quotemark
      "next_level_points": this.reward.next_level_points,
      // tslint:disable-next-line:quotemark
      "rank": this.reward.rank
    };

    const postUrl = AppConfig.ONLY_REWARDS_URL;

    this.http.put(postUrl, postParams, options)
      .subscribe();
  }

  public postPointToNewReward(value: number, pointId: string) {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const postUrl = AppConfig.ONLY_REWARDS_URL;

    const postParams = {
      // tslint:disable-next-line:quotemark
      "id": this.reward.id,
      // tslint:disable-next-line:quotemark
      "points": value,
      // tslint:disable-next-line:quotemark
      "points_obj": this.addPointObj(this.reward.points_obj, pointId),
      // tslint:disable-next-line:quotemark
      "badges_obj": this.reward.badges_obj,
      // tslint:disable-next-line:quotemark
      "level": this.getLevel(value),
      // tslint:disable-next-line:quotemark
      "next_level_points": this.getNextLevelPoints(value),
      // tslint:disable-next-line:quotemark
      "rank": this.getNewRank(value)
    };

    this.http.post(postUrl, postParams, options)
      .subscribe();

  }

  private getLevel(points: number): number {
    const level = Math.floor(points / 10);
    return level;
  }

  private getNextLevelPoints(points: number): number {
    let nextLevelPoints = Math.ceil(points / 10) * 10;
    if (points === nextLevelPoints) {
      nextLevelPoints = nextLevelPoints + 10;
    }

    return nextLevelPoints;
  }

  private addPointObj(pointObj: string, pointId: string): string {

    const point_obj = JSON.parse(pointObj);
    if (point_obj[pointId] !== undefined) {
      point_obj[pointId] += 1;
    } else {
      point_obj[pointId] = 1;
    }

    // return encodeURIComponent(JSON.stringify(point_obj));
    return JSON.stringify(point_obj);
  }

  private addBadgeObj(badgeObj: string, badgeId: string): string {

    const badge_obj = JSON.parse(badgeObj);
    // aqui se añade el id del badge (pendiente de hacer)

    return JSON.stringify(badge_obj);
  }

  private getNewRank(totalPoints: number): string {

    if (totalPoints <= 0 || totalPoints === undefined) {
      totalPoints = 1;
    }

    let newRank: string;
    const rangos = this.ranks;
    Object.keys(rangos).forEach(
      function (index) {
        if (totalPoints >= rangos[index].puntosRango) {
          newRank = rangos[index].nombreRango;
        }
      }
    );

    return newRank;
  }

  private getRanks(studentId: string, pointId: string, value: number) {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    this.http.get(AppConfig.RANGE_URL, options)
      .map((res: Response) => res.json())
      .subscribe(
        (response: Rango[]) => {
          response.sort(this.sortFunction);
          this.ranks = response;
          this.checkIfRewardExists(studentId, pointId, value);
        });
  }

  private sortFunction(a, b) {
    if (a['puntosRango'] === b['puntosRango']) {
      return 0;
    } else {
      return (a['puntosRango'] < b['puntosRango']) ? -1 : 1;
    }
  }

  public getStudentReward(studentId: number): Observable<Reward> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url = AppConfig.STUDENT_URL + '/' + studentId + AppConfig.REWARDS_URL;

    return this.http.get(url, options)
      .map((response: Response) => Reward.toObject(response.json()));

  }

  public getAllRewards(): Observable<Reward[]> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url = AppConfig.STUDENT_URL + AppConfig.REWARDS_URL;

    return this.http.get(url, options)
      .map((response: Response) => Reward.toObjectArray(response.json()));
  }

  public getAllStudentsWithRewards(): Observable<Student[]> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    // tslint:disable-next-line:quotemark
    const request_option = '?filter=%7B%22include%22%3A%5B%22rewards%22%2C%22avatar%22%5D%7D';

    // tslint:disable-next-line:max-line-length
    // const request_option = '?filter=%7B%22include%22%3A%5B%22rewards%22%2C%22avatar%22%5D%2C%20%22where%22%3A%20%7B%22schoolId%22%3A' + schoolId + '%7D%7D';

    const url = AppConfig.STUDENT_URL + request_option;

    return this.http.get(url, options)
      .map((response: Response) => Student.toObjectArray(response.json()));
  }

}
