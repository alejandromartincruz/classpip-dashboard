import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { GroupService } from './group.service';
import {CompetitionService} from './competition.service';
import { AppConfig } from '../../app.config';
import { Competition, Teacher, Student, Group, Matter, Grade, Team, Match } from '../models/index';

@Injectable()
export class TeamService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public groupService: GroupService,
    public gradeService: GradeService,
    public matterService: MatterService,
    public competitionService: CompetitionService) { }

  /**
  * This method returns the list of competitions
  * of a team with the group (grade and matter)
  * @return {Observable<Array<Competition>>} returns the list of competitions
  */
  public getMyCompetitionsGroup(teamId: number): Observable<Array<Competition>> {

    const ret: Array<Competition> = new Array<Competition>();

    return Observable.create(observer => {
      this.getCompetitionsTeam(teamId).subscribe(competitions => {
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
  * This method returns the list of competitions of a team
  * @return {Observable<Array<Competition>>} returns the list of competitions
  */
  public getCompetitionsTeam(teamId: number): Observable<Array<Competition>> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
  return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.COMPETITIONS_URL, options)
  .map((response: Response, index: number) => Competition.toObjectArray(response.json()))
  .catch((error: Response) => this.utilsService.handleAPIError(error));
 }

   /**
  * POST: add a new team
  * @return {Observable<Team>} returns the team
  */
  public postTeam (team: Team): Observable<Team> {
    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.post(AppConfig.TEAM_URL, team, options)
    .map((response: Response, index: number) => Team.toObject(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the list of teams of a competition
  * @return {Observable<Array<Team>>} returns the list of competitions
  */
  public getTeamsCompetition(competitionId: number | string): Observable<Array<Team>> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
     });
    return this.http.get(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.TEAMS_URL, options)
      .map((response: Response, index: number) => Team.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the list of students of a team
  * @return {Observable<Array<Student>>} returns the list of students
  */
  public getStudentsTeam(teamId: number): Observable<Array<Student>> {
    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.get(AppConfig.TEAM_URL + '/' + teamId + AppConfig.STUDENTS_URL, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * This method returns the list of teams of a student
  * @return {Observable<Array<Team>>} returns the list of teams
  */
  public getTeamsStudent(studentId: number): Observable<Array<Team>> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.get(AppConfig.STUDENT_URL + '/' + studentId + AppConfig.TEAMS_URL, options)
      .map((response: Response, index: number) => Team.toObjectArray(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * PUT: made the relation between a student and a team
  * @return {Observable<Response>}
  */
  public relTeamStudent (teamId: string | number, studentId: string | number): Observable<Response> {
    const options: RequestOptions = new RequestOptions({
     headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.put(AppConfig.TEAM_URL + '/' + teamId + AppConfig.STUDENTS_URL
      + AppConfig.REL_URL + '/' + studentId, Response , options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * PUT: made the relation between a competition and a team
  * @return {Observable<Response>}
  */
  public relCompetitionTeam (competitionId: string | number, teamId: string | number): Observable<Response> {
    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
    return this.http.put(AppConfig.COMPETITION_URL + '/' + competitionId + AppConfig.TEAMS_URL
      + AppConfig.REL_URL + '/' + teamId, Response , options)
      .map((response: Response) => response.json())
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
