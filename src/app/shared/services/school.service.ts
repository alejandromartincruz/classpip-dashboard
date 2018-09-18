import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { School, Role, Avatar, Teacher, Student, Point, Badge  } from '../models/index';

@Injectable()
export class SchoolService {

  constructor(
    public http: Http,
    public utilsService: UtilsService) { }

  /**
   * This method returns the current school of the logged
   * in user.
   * @return {Observable<Response>} returns an observable with the result
   * of the operation
   */
  public getMySchool(): Observable<School> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMyUrl() + AppConfig.MYSCHOOL_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => {
        const school: School = School.toObject(response.json());
        this.utilsService.currentSchool = school;
        return school;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns the list of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns an array of teachers
   */
  public getMySchoolTeachers(): Observable<Array<Teacher>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.TEACHERS_URL;

    return this.http.get(url, options)
      .flatMap((response: Response) =>
        Observable.forkJoin(Teacher.toObjectArray(response.json()).map(
          ((teacher: Teacher) => this.http.get(AppConfig.AVATARS_URL + '/' + teacher.avatarId, options)
            .map((res: Response, index: number) => {
              teacher.avatar = Avatar.toObject(res.json());
              return teacher;
            })
          )))
      ).catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns the list of students in the school of the
   * current logged in user
   * @return {Teachers} returns an array of teachers
   */
  public getMySchoolStudents(): Observable<Array<Student>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.STUDENTS_URL;

    return this.http.get(url, options)
      .flatMap((response: Response) =>
        Observable.forkJoin(Student.toObjectArray(response.json()).map(
          ((student: Student) => this.http.get(AppConfig.AVATARS_URL + '/' + student.avatarId, options)
            .map((res: Response, index: number) => {
              student.avatar = Avatar.toObject(res.json());
              return student;
            })
          )))
      ).catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns the amount of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns the number of teachers
   */
  public getMySchoolTeachersCount(): Observable<number> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.TEACHERS_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns the amount of students in the school of the
   * current logged in user
   * @return {number} returns the number of students
   */
  public getMySchoolStudentsCount(): Observable<number> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.STUDENTS_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Point>} returns the list of points
   */
  public getMySchoolPoints(): Observable<Array<Point>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Point.toObjectArray(response.json()))
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Badge>} returns the list of points
   */
   public getMySchoolBadges(): Observable<Array<Badge>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.BADGES_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Badge.toObjectArray(response.json()))
  }



  private getPoints(): Observable<Array<Point>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = this.utilsService.getMyUrl() + AppConfig.POINTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Point.toObjectArray(response.json()))
  }


  /**
   * This method returns the amount of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns the number of teachers
   */
  public getMySchoolPointsCount(): Observable<number> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTS_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  private getBadges(): Observable<Array<Badge>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = this.utilsService.getMyUrl() + AppConfig.BADGES_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Badge.toObjectArray(response.json()))
  }


  /**
   * This method returns the amount of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns the number of teachers
   */
  public getMySchoolBadgesCount(): Observable<number> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.BADGES_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
