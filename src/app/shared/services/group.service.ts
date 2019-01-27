import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AvatarService } from './avatar.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { AppConfig } from '../../app.config';
import { Group, Grade, Matter, Student, Team, CollectionCard } from '../models/index';

@Injectable()
export class GroupService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public avatarService: AvatarService,
    public gradeService: GradeService,
    public matterService: MatterService) { }

  /**
   * This method returns all the information of the groups
   * of the current teacher logged into the application
   * @return {Array<Group>} returns the list of groups
   */
  public getMyGroups(): Observable<Array<Group>> {

    const ret: Array<Group> = new Array<Group>();

    return Observable.create(observer => {
      this.getGroups().subscribe(groups => {
        groups.forEach(group => {
          this.gradeService.getGrade(group.gradeId).subscribe(
            grade => {
              group.grade = grade;
              this.matterService.getMatter(group.matterId).subscribe(
                matter => {
                  group.matter = matter;
                  ret.push(group);
                  if (ret.length === groups.length) {
                    observer.next(ret);
                    observer.complete();
                  }
                }, error => observer.error(error));
            }, error => observer.error(error));
        });
      }, error => observer.error(error));
    });
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Stuent>} returns the list of students
   */
  public getMyGroupStudents(id: string | number): Observable<Array<Student>> {

    const ret: Array<Student> = new Array<Student>();

    return Observable.create(observer => {
      this.getGroupStudents(id).subscribe(students => {
        students.forEach(student => {
          this.avatarService.getAvatar(student.avatarId).subscribe(
            avatar => {
              student.avatar = avatar;
              ret.push(student);
              if (ret.length === students.length) {
                observer.next(ret);
                observer.complete();
              }
            }, error => observer.error(error));
        });
      }, error => observer.error(error));
    });
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Stuent>} returns the list of students
   */
  private getGroupStudents(id: string | number): Observable<Array<Student>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.GROUP_URL + '/' + id + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()));
  }

  /**
   * Returns the groups with the one level information of the current
   * logged in user into the application
   * @return {Array<Group>} returns the list of groups
   */
  private getGroups(): Observable<Array<Group>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMyUrl() + AppConfig.GROUPS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Group.toObjectArray(response.json()));
  }

  /**
   * Returns the information of the group by a group id
   * @return {Group} returns the group
   */
  public getGroup(id: number): Observable<Group> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.GROUP_URL + '/' + id, options)
      .map((response: Response, index: number) => Group.toObject(response.json()))
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * GET: Returns the list of teams of a group
  * @return {Observable<Array<Team>>} returns the list of teams
  */
  public getGroupTeams(groupId: string | number): Observable<Array<Team>> {

   const options: RequestOptions = new RequestOptions({
    headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
   });
   const url: string = AppConfig.GROUP_URL + '/' + groupId + AppConfig.TEAMS_URL;

   return this.http.get(url, options)
    .map((response: Response, index: number) => Team.toObjectArray(response.json()))
    .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * GET: Returns the list of collectionCards of a group
  * @return {Observable<Array<CollectionCard>>} returns the list of teams
  */
 public getGroupCollectionCards(groupId: string | number): Observable<Array<CollectionCard>> {

  const options: RequestOptions = new RequestOptions({
   headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
  });
  const url: string = AppConfig.GROUP_URL + '/' + groupId + AppConfig.COLLECTIONS_URL;

  return this.http.get(url, options)
   .map((response: Response, index: number) => Team.toObjectArray(response.json()))
   .catch((error: Response) => this.utilsService.handleAPIError(error));
 }

}
