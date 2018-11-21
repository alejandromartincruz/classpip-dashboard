import { Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import { AppConfig } from '../../app.config';
import { Competition, Teacher, Student, Group, Matter, Grade, Team, Match } from '../models/index';


@Injectable()
export class CompetitionService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public gradeService: GradeService,
    public matterService: MatterService) { }

  /**
  * This method returns the list of competitions of the current
  * user with the group (grade and matter)
  * @return {Array<Competition>} returns the list of competitions
  */
  public getMyCompetitionsByGroup(group: Group): Observable<Array<Competition>> {
    const ret: Array<Competition> = new Array<Competition>();
    return Observable.create(observer => {
      this.getCompetitionsByGroup(group.id).subscribe(competitions => {
        competitions.forEach(competition => {
          competition.grade = group.grade;
          competition.matter = group.matter;
          ret.push(competition);
          if (ret.length === competitions.length) {
            observer.next(ret);
            observer.complete();
          }
        });
      }, error => observer.error(error));
    });
  }
  /**
  * This method returns the list of competitions by group
  * @return {Array<Competition>} returns the list of competitions
  */
  private getCompetitionsByGroup(groupId: string): Observable<Array<Competition>> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url: string = AppConfig.GROUP_URL + '/' + groupId + AppConfig.COMPETITIONS_URL;
    return this.http.get(url, options)
      .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the list of competitions of
  * the current user logged into the application with
  * the group (grade and matter)
  * @return {Array<Competition>} returns the list of competitions
  */

  public getMyCompetitions(): Observable<Array<Competition>> {

    const ret: Array<Competition> = new Array<Competition>();

    return Observable.create(observer => {
     this.getCompetitions().subscribe(competitions => {
      competitions.forEach(competition => {
        this.groupService.getGroup(competition.groupId).subscribe(
         group => {
          this.gradeService.getGrade(group.gradeId).subscribe(
           grade => {
            competition.grade = grade;
            this.matterService.getMatter(group.matterId).subscribe(
             matter => {
              competition.matter = matter;
              ret.push(competition);
              if (ret.length === competitions.length) {
                observer.next(ret);
                observer.complete();
              }
             }, error => observer.error(error));
           }, error => observer.error(error));
         }, error => observer.error(error));
      });
     }, error => observer.error(error));
    });
  }


  /**
  * This method returns the list of competitions of
  * the current user logged into the application
  * @return {Array<Competition>} returns the list of competitions
  */

  private getCompetitions(): Observable<Array<Competition>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMyUrl() + AppConfig.COMPETITIONS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the competition by its id
  * @return {Observable<Competition>} returns the competition
  */
  public getCompetition(id: number | string): Observable<Competition> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.COMPETITION_URL + '/' + id, options)
      .map((response: Response, index: number) => Competition.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * POST: add a new competition to the database
  * @return {Observable<Competition>} returns the competition
  */
  public postCompetition (competition: Competition): Observable<Competition> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.post(AppConfig.COMPETITION_URL, competition, options)
      .map((response: Response, index: number) => Competition.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * PUT: add new information to the competition
  * @return {Observable<Competition>} returns the competition
  */
  public putInformation (information: string, id: string | number): Observable<Competition> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.put(AppConfig.COMPETITION_URL + '/' + id, information, options)
      .map((response: Response, index: number) => Competition.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * PUT: made the relation between a student and a competition
  * @return {Observable<Response>}
  */
  public relCompetitionStudent (competitionId: string | number, studentId: string | number): Observable<Response> {
    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.put(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.STUDENTS_URL
      + AppConfig.REL_URL + '/' + studentId, Response , options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * GET: get students of a competition
  * @return {Observable<Competition>} returns the list of students
  */
  public getStudentsCompetition(competitionId: string): Observable<Array<Student>> {

    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url: string = AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /** DELETE: delete the competition from the server */
  public deleteCompetition (competitionId: number): Observable<{}> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url = AppConfig.COMPETITION_URL + '/' + competitionId;
    return this.http.delete(url, options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /** DELETE: delete the journeys of one competition from the server */
  public deleteJourneysCompetition (competitionId: number): Observable<{}> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url = AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.JOURNEYS_URL;
    return this.http.delete(url, options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /** DELETE: delete the matches of one journey from the server */
  public deleteMatchesCompetition (journeyId: number): Observable<{}> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    const url = AppConfig.JOURNEY_URL + '/' + journeyId + AppConfig.MATCHES_URL;
    return this.http.delete(url, options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /** DELETE: delete the partitipants of one competition from the server */
  public deleteParticipantsCompetition (competition: Competition): Observable<{}> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    if (competition.mode === 'Individual') {
      return this.http.delete(AppConfig.COMPETITION_URL + '/' + competition.id + AppConfig.STUDENTS_URL, options)
       .map((response: Response) => response.json())
       .catch((error: Response) => this.utilsService.handleAPIError(error));
    } else {
      return this.http.delete(AppConfig.COMPETITION_URL + '/' + competition.id + AppConfig.TEAMS_URL, options)
       .map((response: Response) => response.json())
       .catch((error: Response) => this.utilsService.handleAPIError(error));
    }
  }

}
