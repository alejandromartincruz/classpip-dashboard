import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { School, Role, Avatar, Teacher, Student, Point, Badge } from '../models/index';

@Injectable()
export class SchoolService {

  constructor(
    public http: Http,
    public utilsService: UtilsService
  ) { }

  public getschool(schoolId: number, filterParams: string = ''): Observable<School> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.SCHOOL_URL + '/' + schoolId;

    return this.http.get(url + filterParams, options)
      .map((response: Response, index: number) => {
        const school: School = School.toObject(response.json());
        return school;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

  /**
  * This method returns all the available schools.
  * @return {Observable<Response>} returns an observable with the result
  * of the operation
  */
  public getSchools(): Observable<School[]> {

    const options = this.utilsService.getOptions();
    const url = AppConfig.SCHOOL_URL;
    const requestParams = ''; // '?filter[limit]=' + limit + '&filter[offset]=' + offset;

    return this.http.get(url + requestParams, options)
      .map((response: Response, index: number) => {
        const school: School[] = School.toObjectArray(response.json());
        return school;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * It will generate a new school.
  * @return {Observable<School>} returns an observable with the result
  * of the operation
  */
  public postSchool(postParams: School): Observable<School> {

    const options = this.utilsService.getOptions();

    const postData = [{
      // tslint:disable-next-line:quotemark
      "name": postParams.name,
      // tslint:disable-next-line:quotemark
      "address": postParams.address,
      // tslint:disable-next-line:quotemark
      "image": postParams.image,
      // tslint:disable-next-line:quotemark
      "imageBig": postParams.imageBig,
      // tslint:disable-next-line:quotemark
      "zipCode": postParams.zipCode,
      // tslint:disable-next-line:quotemark
      "city": postParams.city,
      // tslint:disable-next-line:quotemark
      "country": postParams.country,
      // tslint:disable-next-line:quotemark
      "latitude": postParams.latitude,
      // tslint:disable-next-line:quotemark
      "longitude": postParams.longitude,
      // tslint:disable-next-line:quotemark
      "cif": postParams.cif,
      // tslint:disable-next-line:quotemark
      "phone": postParams.phone,
      // tslint:disable-next-line:quotemark
      "website": postParams.website,
      // tslint:disable-next-line:quotemark
      "facebook": postParams.facebook,
      // tslint:disable-next-line:quotemark
      "twitter": postParams.twitter,
      // tslint:disable-next-line:quotemark
      "description": postParams.description
    }];

    const postUrl = AppConfig.SCHOOL_URL;

    return this.http.post(postUrl, postData, options)
      .map((response: Response) => {
        return School.toObject(response.json()[0]);
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
  * It will generate a new school.
  * @return {Observable<School>} returns an observable with the result
  * of the operation
  */
  public patchSchool(patchParams: School): Observable<School> {

    const options = this.utilsService.getOptions();

    const patchData = {
      // tslint:disable-next-line:quotemark
      "name": patchParams.name,
      // tslint:disable-next-line:quotemark
      "address": patchParams.address,
      // tslint:disable-next-line:quotemark
      "image": patchParams.image,
      // tslint:disable-next-line:quotemark
      "imageBig": patchParams.imageBig,
      // tslint:disable-next-line:quotemark
      "zipCode": patchParams.zipCode,
      // tslint:disable-next-line:quotemark
      "city": patchParams.city,
      // tslint:disable-next-line:quotemark
      "country": patchParams.country,
      // tslint:disable-next-line:quotemark
      "latitude": patchParams.latitude,
      // tslint:disable-next-line:quotemark
      "longitude": patchParams.longitude,
      // tslint:disable-next-line:quotemark
      "cif": patchParams.cif,
      // tslint:disable-next-line:quotemark
      "phone": patchParams.phone,
      // tslint:disable-next-line:quotemark
      "website": patchParams.website,
      // tslint:disable-next-line:quotemark
      "facebook": patchParams.facebook,
      // tslint:disable-next-line:quotemark
      "twitter": patchParams.twitter,
      // tslint:disable-next-line:quotemark
      "description": patchParams.description
    };

    const patchUrl = AppConfig.SCHOOL_URL + '/' + patchParams.id;

    return this.http.patch(patchUrl, patchData, options)
      .map((response: Response) => {
        return School.toObject(response.json()[0]);
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteSchool(schoolId: number): Observable<Response> {

    const options = this.utilsService.getOptions();
    const deleteUrl = AppConfig.SCHOOL_URL + '/' + schoolId;

    return this.http.delete(deleteUrl, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns the current school of the logged
   * in user.
   * @return {Observable<Response>} returns an observable with the result
   * of the operation
   */
  public getMySchool(): Observable<School> {

    const options = this.utilsService.getOptions();
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

    const options = this.utilsService.getOptions();
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

    const options = this.utilsService.getOptions();
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

    const options = this.utilsService.getOptions();
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

    const options = this.utilsService.getOptions();
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

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Point.toObjectArray(response.json()));
  }

  /**
   * Returns the list of students by a group id.
   * @return {Array<Badge>} returns the list of points
   */
  public getMySchoolBadges(): Observable<Array<Badge>> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.BADGES_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Badge.toObjectArray(response.json()));
  }



  private getPoints(): Observable<Array<Point>> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.POINTS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Point.toObjectArray(response.json()));
  }


  /**
   * This method returns the amount of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns the number of teachers
   */
  public getMySchoolPointsCount(): Observable<number> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTS_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  private getBadges(): Observable<Array<Badge>> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.BADGES_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Badge.toObjectArray(response.json()));
  }


  /**
   * This method returns the amount of teachers in the school of the
   * current logged in user
   * @return {Teachers} returns the number of teachers
   */
  public getMySchoolBadgesCount(): Observable<number> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMySchoolUrl() + AppConfig.BADGES_URL + AppConfig.COUNT_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => response.json().count)
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
