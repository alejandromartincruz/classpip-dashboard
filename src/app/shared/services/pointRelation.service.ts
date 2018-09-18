import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { PointService } from './point.service';
import { SchoolService } from './school.service';
import { UserService } from './user.service';
import { AppConfig } from '../../app.config';
import { School } from '../models/school';
import { Role } from '../models/role';
import { Avatar } from '../models/avatar';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { Point } from '../models/point';
import { PointRelation } from '../models/pointRelation';
import { Grade } from '../models/grade';
import { Matter } from '../models/matter';
import { ResultPoints } from '../models';


@Injectable()
export class PointRelationService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public userService: UserService,
    public pointService: PointService

    ) { }

  /**
   * Returns the list of students by a group id.
   * @return {Array<PointRelation>} returns the list of points
   */
   public getPointRelation(): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.POINTSRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyStudentPoints(): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl() + AppConfig.POINTSRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }



   /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyStudentPoints1(groupId: string ): Observable<Array<PointRelation>> {

    var ret: Array<PointRelation> = new Array<PointRelation>();
    var obj: Array<PointRelation> = new Array<PointRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array pointRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
       this.getMyStudentPoints().subscribe(
        pointRelations => {
          pointRelations.sort(function (a, b) {
            if (a.pointId > b.pointId) {
              return -1;
            }
            if (a.pointId < b.pointId) {
              return 1;
            }
            return 0;
          });
          pointRelations.forEach(pointRelation => {
            /*ok*/
            if (pointRelation.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === pointRelations.length) {
                count3 = true
              }
            }
            if (pointRelation.groupId == numGroupid){
              /*ok*/
              /* Si coincide el grupo*/
              if (ret.length > 0){
                /*ok*/
                /* El segundo valor lo miramos para ver si ya existe en el array ret*/
                count4 = true
                count5 = false
                count6 = ret.length
                count7 = 0
                ret.forEach(itemRet =>{
                  if (itemRet.pointId == pointRelation.pointId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.pointId != pointRelation.pointId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(pointRelation);
                        count5 = true
                      }
                    }
                    /*OK*/
                  }
                });
              }
              if (ret.length === 0){
                /*ok*/
                /* El primer valor lo introduce en el array ret por defecto*/
                ret.push(pointRelation);
              }
              if (ret.length + count + count2 === pointRelations.length) {
                count3 = true
                /*ko*/
              }
            }
          });
          if (count3 = true) {
              ret.sort(function (a, b) {
                if (a.value > b.value) {
                  return -1;
                }
                if (a.value < b.value) {
                  return 1;
                }
                return 0;
              });
              ret.forEach(itemRet =>{
                this.pointService.getPointName(itemRet.pointId).subscribe(
                  point => {
                    itemRet.point = point;
                    obj.push(itemRet)
                    if (obj.length === ret.length) {
                      observer.next(obj);
                      observer.complete();
                    }
                  }, error => observer.error(error))
                });
              }
        }, error => observer.error(error)
      )
    });
  }

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getStudentPoints(studentId: string): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });
      return this.http.get(AppConfig.STUDENT_URL + '/' + studentId + AppConfig.POINTSRELATION_URL, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))

  }  /** /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyStudentPoints2(groupId: string, studentId: string ): Observable<Array<PointRelation>> {

    var ret: Array<PointRelation> = new Array<PointRelation>();
    var obj: Array<PointRelation> = new Array<PointRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array pointRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
      this.getStudentPoints(studentId).subscribe(
        pointRelations => {
          pointRelations.sort(function (a, b) {
            if (a.pointId > b.pointId) {
              return -1;
            }
            if (a.pointId < b.pointId) {
              return 1;
            }
            return 0;
          });
          pointRelations.forEach(pointRelation => {
            /*ok*/
            if (pointRelation.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === pointRelations.length) {
                count3 = true
              }
            }
            if (pointRelation.groupId == numGroupid){
              /*ok*/
              /* Si coincide el grupo*/
              if (ret.length > 0){
                /*ok*/
                /* El segundo valor lo miramos para ver si ya existe en el array ret*/
                count4 = true
                count5 = false
                count6 = ret.length
                count7 = 0
                ret.forEach(itemRet =>{
                  if (itemRet.pointId == pointRelation.pointId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.pointId != pointRelation.pointId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(pointRelation);
                        count5 = true
                      }
                    }
                    /*OK*/
                  }
                });
              }
              if (ret.length === 0){
                /*ok*/
                /* El primer valor lo introduce en el array ret por defecto*/
                ret.push(pointRelation);
              }
              if (ret.length + count + count2 === pointRelations.length) {
                count3 = true
                /*ko*/
              }
            }
          });
          if (count3 = true) {
              ret.sort(function (a, b) {
                if (a.value > b.value) {
                  return -1;
                }
                if (a.value < b.value) {
                  return 1;
                }
                return 0;
              });
              ret.forEach(itemRet =>{
                this.pointService.getPointName(itemRet.pointId).subscribe(
                  point => {
                    itemRet.point = point;
                    obj.push(itemRet)
                    if (obj.length === ret.length) {
                      observer.next(obj);
                      observer.complete();
                    }
                  }, error => observer.error(error))
                });
              }
        }, error => observer.error(error)
      )
    });
  }

  /**Funcion antigua, no se usa*/
  public getMyStudentPoints3(groupId: string, studentId: string ): Observable<Array<PointRelation>> {

    var ret: Array<PointRelation> = new Array<PointRelation>();
    var obj: Array<PointRelation> = new Array<PointRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array pointRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = 0 /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = 0 /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var numGroupid = parseFloat(groupId)
    var numStudentid = parseFloat(studentId)

    return Observable.create(observer => {
      this.getStudentPoints(studentId).subscribe(
        pointRelations => {
          pointRelations.sort(function (a, b) {
            if (a.pointId > b.pointId) {
              return -1;
            }
            if (a.pointId < b.pointId) {
              return 1;
            }
            return 0;
          });
          pointRelations.forEach(pointRelation => {
            if (pointRelation.groupId == numGroupid){
              if (pointRelations.length == 1){
                /* El primer valor lo introduce en el array obj por defecto*/
                this.pointService.getPointName(pointRelation.pointId).subscribe(
                    point => {
                      pointRelation.point = point;
                      this.userService.getStudentName(pointRelation.studentId).subscribe(
                        student => {
                          pointRelation.student = student;
                          ret.push(pointRelation);
                          observer.next(ret);
                          observer.complete();
                        }, error => observer.error(error))
                    }, error => observer.error(error))
              }
              if (pointRelations.length > 1){
                  /* Si la longitud del Array pointRelations es mayor que 1, hay 2 o mas puntos */
                  if (ret.length == 0){
                    /* El primer valor lo introduce en el array ret por defecto*/
                    this.pointService.getPointName(pointRelation.pointId).subscribe(
                        point => {
                          pointRelation.point = point;
                          this.userService.getStudentName(pointRelation.studentId).subscribe(
                            student => {
                              pointRelation.student = student;
                            }, error => observer.error(error))
                        }, error => observer.error(error))
                    ret.push(pointRelation);
                  }
                  /* En el resto de casos, 1 punto en ret como mínimo*/
                  count4 = 0;
                  ret.forEach(itemRet =>{
                    count4 = count4 + 1
                    if (itemRet.pointId == pointRelation.pointId){
                      if (ret.length ==1){
                        /* solo entra en el caso de que haya 1 punto diferente recorrido */
                        count2 = count2 + 1
                        count3 = 2
                      }
                      else {
                      itemRet.value = itemRet.value + 1
                      count2 = count2 + 1
                      count3 = 2
                      /*OK*/
                      }
                    }
                    if (itemRet.pointId != pointRelation.pointId){
                        /*OK*/
                        if (count4 === ret.length){
                        ret.push(pointRelation);
                        count4 = 0
                        }
                    }
                    if (ret.length + count + count2 === pointRelations.length) {
                    ret.forEach(itemRet =>{
                      this.pointService.getPointName(itemRet.pointId).subscribe(
                        point => {
                          itemRet.point = point;
                          this.userService.getStudentName(itemRet.studentId).subscribe(
                            student => {
                              itemRet.student = student;
                              ret.sort(function (a, b) {
                                if (a.value > b.value) {
                                  return -1;
                                }
                                if (a.value < b.value) {
                                  return 1;
                                }
                                return 0;
                              });
                              observer.next(ret);
                              observer.complete();
                            }, error => observer.error(error))
                        }, error => observer.error(error))
                      });
                    }
                  });
                  /* Una vez recorrido el Array obj si no se encontraba repetido se copia el nuevo punto*/

              }
            }
            else {
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count + count2 === pointRelations.length) {
                ret.forEach(itemRet =>{
                  this.pointService.getPointName(itemRet.pointId).subscribe(
                    point => {
                      itemRet.point = point;
                      this.userService.getStudentName(itemRet.studentId).subscribe(
                        student => {
                          itemRet.student = student;
                          ret.sort(function (a, b) {
                            if (a.value > b.value) {
                              return -1;
                            }
                            if (a.value < b.value) {
                              return 1;
                            }
                            return 0;
                          });
                          observer.next(ret);
                          observer.complete();
                        }, error => observer.error(error))
                    }, error => observer.error(error))
                });
              }
            }
          });
        }, error => observer.error(error)
      )
    });
  }


  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getPointPoints(pointId: string): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.POINT_URL + '/' + pointId + AppConfig.POINTSRELATION_URL, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))

  }

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyPointPoints2(groupId: string, pointId: string ): Observable<Array<PointRelation>> {

    var ret: Array<PointRelation> = new Array<PointRelation>();
    var obj: Array<PointRelation> = new Array<PointRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array pointRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
      this.getPointPoints(pointId).subscribe(
        pointRelationsPoint => {
          pointRelationsPoint.sort(function (a, b) {
            if (a.studentId > b.studentId) {
              return -1;
            }
            if (a.studentId < b.studentId) {
              return 1;
            }
            return 0;
          });
          pointRelationsPoint.forEach(pointRelationPoint => {
            /*ok*/
            if (pointRelationPoint.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === pointRelationsPoint.length) {
                count3 = true
              }
            }
            if (pointRelationPoint.groupId == numGroupid){
              /*ok*/
              /* Si coincide el grupo*/
              if (ret.length > 0){
                /*ok*/
                /* El segundo valor lo miramos para ver si ya existe en el array ret*/
                count4 = true
                count5 = false
                count6 = ret.length
                count7 = 0
                ret.forEach(itemRet =>{
                  if (itemRet.studentId == pointRelationPoint.studentId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.studentId != pointRelationPoint.studentId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(pointRelationPoint);
                        count5 = true
                      }
                    }
                    /*OK*/
                  }
                });
              }
              if (ret.length === 0){
                /*ok*/
                /* El primer valor lo introduce en el array ret por defecto*/
                ret.push(pointRelationPoint);
              }
              if (ret.length + count + count2 === pointRelationsPoint.length) {
                count3 = true
                /*ko*/
              }
            }
          });
          if (count3 = true) {
              ret.sort(function (a, b) {
                if (a.value > b.value) {
                  return -1;
                }
                if (a.value < b.value) {
                  return 1;
                }
                return 0;
              });
              ret.forEach(itemRet =>{
                this.userService.getStudentName2(itemRet.studentId).subscribe(
                  student => {
                    itemRet.student = student;
                    obj.push(itemRet)
                    if (obj.length === ret.length) {
                      observer.next(obj);
                      observer.complete();
                    }
                  }, error => observer.error(error))
                });
              }
        }, error => observer.error(error)
      )
    });
  }




  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyGroupPoints(id: string): Observable<Array<PointRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.GROUP_URL + '/' + id + AppConfig.POINTSRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => PointRelation.toObjectArray(response.json()))
  }

  /**
   * This method returns all the relation points of the student in this group
   * of the current students logged into the application
   * @return {Array<PointRelation>} returns the list of groups
   */
  public getMyGroupStudentPoints(id: string /*, studentId: string*/): Observable<Array<PointRelation>> {

    var ret: Array<PointRelation> = new Array<PointRelation>();
    var count = 0
    var numid = parseFloat(id)
    var pointt = 100000
    return Observable.create(observer => {
      this.getMyGroupPoints(id).subscribe(
        pointRelations => {
          pointRelations.forEach(pointRelation => {
            if (pointRelation.pointId = pointt){
              count = count + 1
            this.pointService.getPointName(pointRelation.pointId).subscribe(
              point => {
                pointRelation.point = point;
                this.userService.getStudentName(pointRelation.studentId).subscribe(
                  student => {
                    pointRelation.student = student;
                    ret.push(pointRelation);
                    if (ret.length === pointRelations.length) {
                      observer.next(ret);
                      observer.complete();
                    }
                  }, error => observer.error(error))
              }, error => observer.error(error))
              }
            else{
              ret.splice(count,1);
            }
          /*if (pointRelation.studentId = studentId){
              ret.push(pointRelation);
            }
            else {
              observer.next(ret);
            }*/
          });
        }, error => observer.error(error)
      )
    });
  }


  /**
   * This method calls the REST API for performing a post of pointRelation against
   * the common services for the application
   * @param {PointRelation} pointRelation Object with login credentials
   * @return {Observable<PointRelation>} observable object with the login response
   */

  public toObject(pointRelation: PointRelation): PointRelation {

    let result: PointRelation = new PointRelation();
    if (pointRelation != null) {
      result.value = pointRelation.value;
      result.pointId = pointRelation.pointId;
	    result.groupId = pointRelation.groupId;
      result.studentId = pointRelation.studentId;
      result.schoolId = pointRelation.schoolId;
    }
    return result;
  }

  public postPointRelation(pointId: string, studentId: string, schoolId: string, groupId: string, value: number): Observable<PointRelation> {

    let options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });


    var url: string;
    url = AppConfig.POINTRELATION_URL;

    let postParams = {

        value: value,
        pointId: pointId,
        studentId: studentId,
        schoolId: schoolId,
        groupId: groupId

      }

    return this.http.post(url, postParams, options)
        .map(response => {
          return PointRelation.toObject(response.json());
        })

        .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deletePointRelations(id: string): Observable<Point> {
    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.delete(AppConfig.POINT_URL + '/' + id + AppConfig.POINTSRELATION_URL, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deletePointRelationsSchool(id: string): Observable<Point> {
    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.delete(AppConfig.SCHOOL_URL + '/' + id + AppConfig.POINTSRELATION_URL, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }



}


