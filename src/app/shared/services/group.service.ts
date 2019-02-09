import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AvatarService } from './avatar.service';
import { GradeService } from './grade.service';
import { MatterService } from './matter.service';
import { AppConfig } from '../../app.config';
import { Group, Grade, Matter, Student } from '../models/index';

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
  public getMyGroupStudents(id: string): Observable<Array<Student>> {

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
  private getGroupStudents(id: string): Observable<Array<Student>> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL + '/' + id + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObjectArray(response.json()));
  }

  /**
   * Returns the groups with the one level information of the current
   * logged in user into the application
   * @return {Array<Group>} returns the list of groups
   */
  private getGroups(): Observable<Array<Group>> {

    const options = this.utilsService.getOptions();
    const url = this.utilsService.getMyUrl() + AppConfig.GROUPS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Group.toObjectArray(response.json()));
  }

  public getGroupsBySchool(schoolId: number): Observable<Group[]> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL;
    // tslint:disable-next-line:max-line-length
    const params = '?filter=%7B%22include%22%3A%5B%22teachers%22%2C%22grades%22%2C%22matters%22%2C%22students%22%5D%2C%20%22where%22%3A%20%7B%22schoolId%22%3A' + schoolId + '%7D%7D';

    return this.http.get(url + params, options)
      .map((response: Response, index: number) => Group.toObjectArray(response.json()));
  }

  public addStudentToGroup(postParams: {}): Observable<Response> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL + '/' + postParams['groupId'] + '/students/rel/' + postParams['studentId'];

    return this.http.put(url, options)
      .map((response: Response, index: number) => response.json());
  }

  public removeStudentFromGroup(studentId: number, groupId: number): Observable<Response> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL + '/' + groupId + '/students/rel/' + studentId;

    return this.http.delete(url, options)
      .map((response: Response, index: number) => response.json());
  }

  public postGroup(postParams: Group): Observable<Group> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL;

    const postGroup = {
      // tslint:disable-next-line:quotemark
      "name": postParams.name,
      // tslint:disable-next-line:quotemark
      "schoolId": postParams.schoolId,
      // tslint:disable-next-line:quotemark
      "teacherId": postParams.teacherId,
      // tslint:disable-next-line:quotemark
      "gradeId": postParams.gradeId,
      // tslint:disable-next-line:quotemark
      "matterId": postParams.matterId
    };

    return this.http.post(url, postGroup, options)
      .map((response: Response) => {
        return Group.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  deleteGroup(groupId: number): Observable<Group> {
    const options = this.utilsService.getOptions();
    const url = AppConfig.GROUP_URL + '/' + groupId;

    return this.http.delete(url, options)
      .map((response: Response) => {
        return Group.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
