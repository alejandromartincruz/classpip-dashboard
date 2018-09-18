import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

import { UtilsService } from './utils.service';
import { BadgeService } from './badge.service';
import { SchoolService } from './school.service';
import { UserService } from './user.service';
import { AppConfig } from '../../app.config';
import { School } from '../models/school';
import { Role } from '../models/role';
import { Avatar } from '../models/avatar';
import { Teacher } from '../models/teacher';
import { Student } from '../models/student';
import { Badge } from '../models/badge';
import { BadgeRelation } from '../models/badgeRelation';
import { Grade } from '../models/grade';
import { Matter } from '../models/matter';

@Injectable()
export class BadgeRelationService {

  constructor(
    public http: Http,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public userService: UserService,
    public badgeService: BadgeService

    ) { }

  /**
   * Returns the list of students by a group id.
   * @return {Array<BadgeRelation>} returns the list of badges
   */
   public getBadgeRelation(): Observable<Array<BadgeRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMySchoolUrl() + AppConfig.BADGESRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => BadgeRelation.toObjectArray(response.json()))
  }

  /**
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyStudentBadges(): Observable<Array<BadgeRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = this.utilsService.getMyUrl() + AppConfig.BADGESRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => BadgeRelation.toObjectArray(response.json()))
  }



   /**
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyStudentBadges1(groupId: string ): Observable<Array<BadgeRelation>> {

    var ret: Array<BadgeRelation> = new Array<BadgeRelation>();
    var obj: Array<BadgeRelation> = new Array<BadgeRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array badgeRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
       this.getMyStudentBadges().subscribe(
        badgeRelations => {
          badgeRelations.sort(function (a, b) {
            if (a.badgeId > b.badgeId) {
              return -1;
            }
            if (a.badgeId < b.badgeId) {
              return 1;
            }
            return 0;
          });
          badgeRelations.forEach(badgeRelation => {
            /*ok*/
            if (badgeRelation.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === badgeRelations.length) {
                count3 = true
              }
            }
            if (badgeRelation.groupId == numGroupid){
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
                  if (itemRet.badgeId == badgeRelation.badgeId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.badgeId != badgeRelation.badgeId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(badgeRelation);
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
                ret.push(badgeRelation);
              }
              if (ret.length + count + count2 === badgeRelations.length) {
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
                this.badgeService.getBadgeName(itemRet.badgeId).subscribe(
                  badge => {
                    itemRet.badge = badge;
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
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getStudentBadges(studentId: string): Observable<Array<BadgeRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.STUDENT_URL + '/' + studentId + AppConfig.BADGESRELATION_URL, options)
      .map((response: Response, index: number) => BadgeRelation.toObjectArray(response.json()))

  }

  /**
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyStudentBadges2(groupId: string, studentId: string ): Observable<Array<BadgeRelation>> {

    var ret: Array<BadgeRelation> = new Array<BadgeRelation>();
    var obj: Array<BadgeRelation> = new Array<BadgeRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array badgeRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
      this.getStudentBadges(studentId).subscribe(
        badgeRelations => {
          badgeRelations.sort(function (a, b) {
            if (a.badgeId > b.badgeId) {
              return -1;
            }
            if (a.badgeId < b.badgeId) {
              return 1;
            }
            return 0;
          });
          badgeRelations.forEach(badgeRelation => {
            /*ok*/
            if (badgeRelation.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === badgeRelations.length) {
                count3 = true
              }
            }
            if (badgeRelation.groupId == numGroupid){
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
                  if (itemRet.badgeId == badgeRelation.badgeId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.badgeId != badgeRelation.badgeId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(badgeRelation);
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
                ret.push(badgeRelation);
              }
              if (ret.length + count + count2 === badgeRelations.length) {
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
                this.badgeService.getBadgeName(itemRet.badgeId).subscribe(
                  badge => {
                    itemRet.badge = badge;
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
  public getMyStudentBadges3(groupId: string, studentId: string ): Observable<Array<BadgeRelation>> {

    var ret: Array<BadgeRelation> = new Array<BadgeRelation>();
    var obj: Array<BadgeRelation> = new Array<BadgeRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array badgeRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = 0 /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = 0 /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var numGroupid = parseFloat(groupId)
    var numStudentid = parseFloat(studentId)

    return Observable.create(observer => {
      this.getStudentBadges(studentId).subscribe(
        badgeRelations => {
          badgeRelations.sort(function (a, b) {
            if (a.badgeId > b.badgeId) {
              return -1;
            }
            if (a.badgeId < b.badgeId) {
              return 1;
            }
            return 0;
          });
          badgeRelations.forEach(badgeRelation => {
            if (badgeRelation.groupId == numGroupid){
              if (badgeRelations.length == 1){
                /* El primer valor lo introduce en el array obj por defecto*/
                this.badgeService.getBadgeName(badgeRelation.badgeId).subscribe(
                    badge => {
                      badgeRelation.badge = badge;
                      this.userService.getStudentName(badgeRelation.studentId).subscribe(
                        student => {
                          badgeRelation.student = student;
                          ret.push(badgeRelation);
                          observer.next(ret);
                          observer.complete();
                        }, error => observer.error(error))
                    }, error => observer.error(error))
              }
              if (badgeRelations.length > 1){
                  /* Si la longitud del Array badgeRelations es mayor que 1, hay 2 o mas puntos */
                  if (ret.length == 0){
                    /* El primer valor lo introduce en el array ret por defecto*/
                    this.badgeService.getBadgeName(badgeRelation.badgeId).subscribe(
                        badge => {
                          badgeRelation.badge = badge;
                          this.userService.getStudentName(badgeRelation.studentId).subscribe(
                            student => {
                              badgeRelation.student = student;
                            }, error => observer.error(error))
                        }, error => observer.error(error))
                    ret.push(badgeRelation);
                  }
                  /* En el resto de casos, 1 punto en ret como mínimo*/
                  count4 = 0;
                  ret.forEach(itemRet =>{
                    count4 = count4 + 1
                    if (itemRet.badgeId == badgeRelation.badgeId){
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
                    if (itemRet.badgeId != badgeRelation.badgeId){
                        /*OK*/
                        if (count4 === ret.length){
                        ret.push(badgeRelation);
                        count4 = 0
                        }
                    }
                    if (ret.length + count + count2 === badgeRelations.length) {
                    ret.forEach(itemRet =>{
                      this.badgeService.getBadgeName(itemRet.badgeId).subscribe(
                        badge => {
                          itemRet.badge = badge;
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
              if (ret.length + count + count2 === badgeRelations.length) {
                ret.forEach(itemRet =>{
                  this.badgeService.getBadgeName(itemRet.badgeId).subscribe(
                    badge => {
                      itemRet.badge = badge;
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
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getBadgeBadges(badgeId: string): Observable<Array<BadgeRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.get(AppConfig.BADGE_URL + '/' + badgeId + AppConfig.BADGESRELATION_URL, options)
      .map((response: Response, index: number) => BadgeRelation.toObjectArray(response.json()))

  }


  public deleteBadgeRelations(id: string): Observable<Badge> {
    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.delete(AppConfig.BADGE_URL + '/' + id + AppConfig.BADGESRELATION_URL, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteBadgeRelationsSchool(id: string): Observable<Badge> {
    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    return this.http.delete(AppConfig.SCHOOL_URL + '/' + id + AppConfig.BADGESRELATION_URL, options)
      .map(response => {
        return response;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyBadgeBadges2(groupId: string, badgeId: string ): Observable<Array<BadgeRelation>> {

    var ret: Array<BadgeRelation> = new Array<BadgeRelation>();
    var obj: Array<BadgeRelation> = new Array<BadgeRelation>();
    var count = 0 /* Este contador es para contar las veces que un elemento del array badgeRelations no se copia en el array ret*/
    var count2 = 0 /* Este contador es para contar las veces que un elemento del array ret no se copia en el array obj*/
    var count3 = false /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count4 = true /* Este contador es para hacer el push del objeto si no se encuentra repetido en el array obj*/
    var count5 = false
    var count6 = 0
    var count7 = 0
    var numGroupid = parseFloat(groupId)

    return Observable.create(observer => {
      this.getBadgeBadges(badgeId).subscribe(
        badgeRelationsBadge => {
          badgeRelationsBadge.sort(function (a, b) {
            if (a.studentId > b.studentId) {
              return -1;
            }
            if (a.studentId < b.studentId) {
              return 1;
            }
            return 0;
          });
          badgeRelationsBadge.forEach(badgeRelationBadge => {
            /*ok*/
            if (badgeRelationBadge.groupId != numGroupid){
              /*ok*/
              /* Si no coincide el grupo*/
              count = count + 1
              if (ret.length + count === badgeRelationsBadge.length) {
                count3 = true
              }
            }
            if (badgeRelationBadge.groupId == numGroupid){
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
                  if (itemRet.studentId == badgeRelationBadge.studentId){
                    itemRet.value = itemRet.value + 1
                    count2 = count2 + 1
                    count4 = false;
                    count5 = false
                    count7 = count7 + 1
                    /*OK*/
                  }
                  if (itemRet.studentId != badgeRelationBadge.studentId){
                    count7 = count7 + 1
                    if(count6 === count7){
                      if (count4 = true){
                        ret.push(badgeRelationBadge);
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
                ret.push(badgeRelationBadge);
              }
              if (ret.length + count + count2 === badgeRelationsBadge.length) {
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
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyGroupBadges(id: string): Observable<Array<BadgeRelation>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.GROUP_URL + '/' + id + AppConfig.BADGESRELATION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => BadgeRelation.toObjectArray(response.json()))
  }

  /**
   * This method returns all the relation badges of the student in this group
   * of the current students logged into the application
   * @return {Array<BadgeRelation>} returns the list of groups
   */
  public getMyGroupStudentBadges(id: string /*, studentId: string*/): Observable<Array<BadgeRelation>> {

    var ret: Array<BadgeRelation> = new Array<BadgeRelation>();
    var count = 0
    var numid = parseFloat(id)
    var badget = 100000
    return Observable.create(observer => {
      this.getMyGroupBadges(id).subscribe(
        badgeRelations => {
          badgeRelations.forEach(badgeRelation => {
            if (badgeRelation.badgeId = badget){
              count = count + 1
            this.badgeService.getBadgeName(badgeRelation.badgeId).subscribe(
              badge => {
                badgeRelation.badge = badge;
                this.userService.getStudentName(badgeRelation.studentId).subscribe(
                  student => {
                    badgeRelation.student = student;
                    ret.push(badgeRelation);
                    if (ret.length === badgeRelations.length) {
                      observer.next(ret);
                      observer.complete();
                    }
                  }, error => observer.error(error))
              }, error => observer.error(error))
              }
            else{
              ret.splice(count,1);
            }
          /*if (badgeRelation.studentId = studentId){
              ret.push(badgeRelation);
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
   * This method calls the REST API for performing a post of badgeRelation against
   * the common services for the application
   * @param {BadgeRelation} badgeRelation Object with login credentials
   * @return {Observable<BadgeRelation>} observable object with the login response
   */

  public toObject(badgeRelation: BadgeRelation): BadgeRelation {

    let result: BadgeRelation = new BadgeRelation();
    if (badgeRelation != null) {
      result.value = badgeRelation.value;
      result.badgeId = badgeRelation.badgeId;
	    result.groupId = badgeRelation.groupId;
      result.studentId = badgeRelation.studentId;
      result.schoolId = badgeRelation.schoolId;
    }
    return result;
  }

  public postBadgeRelation(badgeId, studentId, schoolId, groupId, value): Observable<BadgeRelation> {

    let options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });
      var url: string;
    url = AppConfig.BADGERELATION_URL;

      let postParams = {

        value: value,
        badgeId: badgeId,
        studentId: studentId,
        schoolId: schoolId,
        groupId: groupId

      }

    return this.http.post(url, postParams, options)

        .map(response => {
          return BadgeRelation.toObject(response.json());
        })
        .catch((error: Response) => this.utilsService.handleAPIError(error));
  }



}


