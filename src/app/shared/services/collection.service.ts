import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { UtilsService } from './utils.service';
import { CollectionCard } from '../models/collectionCard';
import { AppConfig } from '../../app.config';
import { Card } from '../models/card';
import { Group } from '../models/group';
import { Student } from '../models/student';


@Injectable()
export class CollectionService {

  constructor(public http: Http,
    public utilsService: UtilsService) {
  }
  /**
  * This method returns the CollectionCard of the id
  * @return {CollectionCard} returns a collectionCard
  */
  public getCollection(id: number): Observable<CollectionCard> {

    const options = this.utilsService.getOptions();

    return this.http.get(AppConfig.COLLECTION_URL + '/' + id, options)
      .map((response: Response, index: number) => CollectionCard.toObject(response.json()));
  }
  /**
   * This method returns the list of CollectionCards in the school
   * @return {CollectionCard} returns an array of collectionCards
   */
  public getCollections(): Observable<Array<CollectionCard>> {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => CollectionCard.toObjectArray(response.json()));

  }

  /**
   * This method returns the list of CollectionCards in the school of the
   * current logged in user
   * @return {CollectionCard} returns an array of collectionCards
   */
  public getMyCollections(): Observable<Array<CollectionCard>> {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.COLLECTIONS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => CollectionCard.toObjectArray(response.json()));

  }
  /**
   * This method returns the list of cards of a certain collectionCard
   * @return {Card} returns an array of Cards
   */
  public getCollectionDetails(id): Observable<Array<Card>> {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + id + AppConfig.CARDS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Card.toObjectArray(response.json()));

  }

  /**
   * This method saves the new Collection on DB
   * @param {CollectionCard} collectionCard
   * @returns {Observable<any>}
   */
  public postCollection(collectionCard: CollectionCard) {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.COLLECTIONS_URL;

    const body = {
      // tslint:disable-next-line:quotemark
      "name": collectionCard.name,
      // tslint:disable-next-line:quotemark
      "num": collectionCard.num,
      // tslint:disable-next-line:quotemark
      "image": collectionCard.image,
      // tslint:disable-next-line:quotemark
      "createdBy": collectionCard.createdBy,
      // tslint:disable-next-line:quotemark
      "badgeId": collectionCard.badgeId,
      // "teacherId": this.utilsService.currentUser.userId
    };



    return this.http.post(url, body, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * Method to assign a collection of cards to a group of users
   *
   * @param collectionId
   * @param groupId
   * @returns {Observable<any>}
   */
  public assignCollection(collectionId, groupId) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + collectionId + AppConfig.GROUPS_URL + '/rel/' + groupId;
    return this.http.put(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * Method to delete a collection created by user
   *
   * @param collectionId
   * @returns {Observable<any>}
   */
  public deleteCollection(collectionId) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + collectionId;


    return this.http.delete(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * Method to delete the relation between collection and user
   *
   * @param collectionId
   * @returns {Observable<any>}
   */
  public deleteCollectionRelation(collectionId) {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.COLLECTIONS_URL + '/rel/' + collectionId;

    return this.http.delete(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public editCollection(collectionCard: CollectionCard) {

    const options = this.utilsService.getOptions();

    const url: string = this.utilsService.getMyUrl() + AppConfig.COLLECTIONS_URL + '/' + collectionCard.id;
    const body = {
      // tslint:disable-next-line:quotemark
      "name": collectionCard.name,
      // tslint:disable-next-line:quotemark
      "image": collectionCard.image,
      // tslint:disable-next-line:quotemark
      "num": collectionCard.num,
      // tslint:disable-next-line:quotemark
      "createdBy": collectionCard.createdBy
    };

    return this.http.put(url, body, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public getAssignedGroups(collectionId): Observable<Array<Group>> {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + collectionId + AppConfig.GROUPS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Group.toObjectArray(response.json()));
  }

  public deleteAssignedGroup(collectionId, groupId) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + collectionId + AppConfig.GROUPS_URL + '/rel/' + groupId;

    return this.http.delete(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public postCard(card: Card) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + card.collectionId + AppConfig.CARDS_URL;
    const body = {
      // tslint:disable-next-line:quotemark
      "name": card.name,
      // tslint:disable-next-line:quotemark
      "ratio": card.ratio,
      // tslint:disable-next-line:quotemark
      "rank": card.rank,
      // tslint:disable-next-line:quotemark
      "image": card.image
    };

    return this.http.post(url, body, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public assignCollectionToStudent(studentId, collectionId) {
    const options = this.utilsService.getOptions();
    const url: string = AppConfig.COLLECTION_URL + '/' + collectionId + AppConfig.STUDENTS_URL + '/rel/' + studentId;

    return this.http.put(url, null, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public deleteCard(cardId) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.CARD_URL + '/' + cardId;


    return this.http.delete(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }
  public editCard(card: Card) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.CARD_URL + '/' + card.id;
    const body = {
      // tslint:disable-next-line:quotemark
      "name": card.name,
      // tslint:disable-next-line:quotemark
      "image": card.image,
      // tslint:disable-next-line:quotemark
      "ratio": card.ratio,
      // tslint:disable-next-line:quotemark
      "rank": card.rank
    };

    return this.http.put(url, body, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }
  public getAssignedCards() {

    const options = this.utilsService.getOptions();
    const url: string = this.utilsService.getMyUrl() + AppConfig.CARDS_URL;

    return this.http.get(url, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public assignCardToStudent(studentId, cardId) {

    const options = this.utilsService.getOptions();
    const url: string = AppConfig.CARD_URL + '/' + cardId + AppConfig.STUDENTS_URL + '/rel/' + studentId;

    return this.http.put(url, null, options)
      .map(response => {
        return response.json();
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }
}
