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
import { LevelService } from './level.service';


@Injectable()
export class RewardService {

  public reward: Reward;
  public ranks: Rango[];
  public rank: Rango;
  public exists: boolean;

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public levelService: LevelService
  ) { }

  public addPointsProcess(studentId: string, pointId: string, value: number) {
    this.levelService.getAllRanks().subscribe(
      (response: Rango[]) => {
        this.ranks = response;
        this.rewardCheck(studentId, pointId, value);
      });
  }

  public rewardCheck(studentId: string, pointId: string, value: number) {
    this.checkIfRewardExists(studentId).subscribe(
      (res: Array<boolean>) => {
        this.exists = res['exists'];
        if (this.exists) {
          this.addPoint(studentId, pointId, value);
        } else {
          this.addPointToNewReward(studentId, pointId, value);
        }

      }
    );
  }

  public checkIfRewardExists(studentId: string): Observable<Array<boolean>> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.ONLY_REWARDS_URL + '/' + studentId + AppConfig.EXISTS_URL;

    return this.http.get(url, options)
      .map((res: Response) => res.json());
  }

  public addPointToNewReward(studentId: string, pointId: string, value: number) {
    this.emptyReward(studentId);
    this.postPointToNewReward(value, pointId);
  }

  public addPoint(studentId: string, pointId: string, value: number) {

    const options = this.utilsService.getOptions();
    const url = AppConfig.STUDENT_URL + '/' + studentId + AppConfig.REWARDS_URL;

    this.http.get(url, options)
      .map((res: Response) => res.json())
      .subscribe(
        (reward) => {
          this.reward = reward;
          this.postPointToReward(value, pointId);
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

  private postPointToReward(value: number, pointId: string) {

    const options = this.utilsService.getOptions();
    let pointsEarned = this.reward.points + value;
    if (pointsEarned <= 0) {
      pointsEarned = 0;
    }
    this.reward.points = pointsEarned;
    this.reward.level = this.levelService.getLevel(this.reward.points);
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

    const options = this.utilsService.getOptions();
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
      "level": this.levelService.getLevel(value),
      // tslint:disable-next-line:quotemark
      "next_level_points": this.getNextLevelPoints(value),
      // tslint:disable-next-line:quotemark
      "rank": this.getNewRank(value)
    };

    this.http.post(postUrl, postParams, options)
      .subscribe();

  }

  private getNextLevelPoints(points: number): number {

    let nextLevelPoints = (Math.ceil(points / 10) * 10) - points;

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

  public getStudentReward(studentId: number): Observable<Reward> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.STUDENT_URL + '/' + studentId + AppConfig.REWARDS_URL;

    return this.http.get(url, options)
      .map((response: Response) => Reward.toObject(response.json()));

  }

  public getAllRewards(): Observable<Reward[]> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.STUDENT_URL + AppConfig.REWARDS_URL;

    return this.http.get(url, options)
      .map((response: Response) => Reward.toObjectArray(response.json()));
  }

  public getAllStudentsWithRewards(schoolId: string = ''): Observable<Student[]> {

    const options = this.utilsService.getOptions();

    // tslint:disable-next-line:quotemark
    let request_option = '?filter=%7B%22include%22%3A%5B%22rewards%22%2C%22avatar%22%5D%7D';

    if (schoolId !== '') {
      // tslint:disable-next-line:max-line-length
      request_option = '?filter=%7B%22include%22%3A%20%5B%22rewards%22%2C%22avatar%22%5D%2C%20%22where%22%3A%7B%22schoolId%22%3A' + schoolId + '%7D%7D';
    }


    const url = AppConfig.STUDENT_URL + request_option;

    return this.http.get(url, options)
      .map((response: Response) => Student.toObjectArray(response.json()));
  }

  public newReward(studentId) {

    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.ONLY_REWARDS_URL;

    const postParams = {
      // tslint:disable-next-line:quotemark
      "id": studentId,
      // tslint:disable-next-line:quotemark
      "points": 0,
      // tslint:disable-next-line:quotemark
      "points_obj": JSON.stringify({}),
      // tslint:disable-next-line:quotemark
      "badges_obj": JSON.stringify({}),
      // tslint:disable-next-line:quotemark
      "level": 0,
      // tslint:disable-next-line:quotemark
      "next_level_points": this.getNextLevelPoints(0),
      // tslint:disable-next-line:quotemark
      "rank": "bronce"
    };

    this.http.post(postUrl, postParams, options)
      .subscribe();
  }

  public deleteReward(studentId) {
    const options = this.utilsService.getOptions();
    const url = AppConfig.ONLY_REWARDS_URL + '/' + studentId;

    this.http.delete(url, options)
      .subscribe();
  }

}
