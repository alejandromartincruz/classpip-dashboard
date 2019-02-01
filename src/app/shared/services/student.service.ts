import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Student } from '../models/index';

@Injectable()
export class StudentService {

  constructor(
    public http: Http,
    public utilsService: UtilsService
  ) { }

  // function to create or edit a student
  public postStudent(postParams: Student): Observable<Student> {
    const options = this.utilsService.getOptions();
    const postUrl = AppConfig.STUDENT_URL + '/replaceOrCreate';
    const postData = {
      // tslint:disable-next-line:quotemark
      "id": postParams.id,
      // tslint:disable-next-line:quotemark
      "name": postParams.name,
      // tslint:disable-next-line:quotemark
      "surname": postParams.surname,
      // tslint:disable-next-line:quotemark
      "username": postParams.username,
      // tslint:disable-next-line:quotemark
      "email": postParams.email,
      // tslint:disable-next-line:quotemark
      "profileImage": postParams.profileImage,
      // tslint:disable-next-line:quotemark
      "password": postParams['password'],
      // tslint:disable-next-line:quotemark
      "schoolId": postParams.schoolId,
      // tslint:disable-next-line:quotemark
      "avatarId": postParams.avatarId
    };

    return this.http.post(postUrl, postData, options)
      .map((response: Response) => {
        return Student.toObject(response.json());
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

  public deleteStudent(studentId: number): Observable<Response> {
    const options = this.utilsService.getOptions();
    const deleteUrl = AppConfig.STUDENT_URL + '/' + studentId;

    return this.http.delete(deleteUrl, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

}
