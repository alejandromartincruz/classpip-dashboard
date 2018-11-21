import { Grade, Matter } from './index';

export class Competition {

  private _id: string;
  private _name: string;
  private _type: string;
  private _mode: string;
  private _numParticipants: number;
  private _numJourneys: number;
  private _information: string;
  private _groupId: number;
  private _grade: Grade;
  private _matter: Matter;


  constructor(id?: string, name?: string, type?: string, mode?: string,
    numParticipants?: number, numJourneys?: number, information?: string,
    groupId?: number, grade?: Grade, matter?: Matter) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._mode = mode;
    this._numParticipants = numParticipants;
    this._numJourneys = numJourneys;
    this._information = information;
    this._groupId = groupId;
    this._grade = grade;
    this._matter = matter;
  }

  /* tslint:disable */
  static toObject(object: any): Competition {
    /* tslint:enable */
    const result: Competition = new Competition();
    if (object != null) {
      result.id = object.id;     /* result.id  no me dara error en .id, .name, .type, etc cuando lo defina en set*/
      result.name = object.name;
      result.type = object.type;
      result.mode = object.mode;
      result.numParticipants = object.numParticipants;
      result.numJourneys = object.numJourneys;
      result.information = object.information;
      result.groupId = object.groupId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Competition> {
    /* tslint:enable */
    const resultArray: Array<Competition> = new Array<Competition>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Competition.toObject(object[i]));
      }
    }
    return resultArray;
  }


  /*  Getters and Setters  */

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get type(): string {
    return this._type;
  }

  public set type(value: string) {
    this._type = value;
  }

  public get mode(): string {
    return this._mode;
  }

  public set mode(value: string) {
    this._mode = value;
  }

  public get numParticipants(): number {
    return this._numParticipants;
  }

  public set numParticipants(value: number) {
    this._numParticipants = value;
  }

  public get numJourneys(): number {
    return this._numJourneys;
  }

  public set numJourneys(value: number) {
    this._numJourneys = value;
  }

  public get information(): string {
    return this._information;
  }

  public set information(value: string) {
    this._information = value;
  }

  public get groupId(): number {
    return this._groupId;
  }

  public set groupId(value: number) {
    this._groupId = value;
  }

  public get grade(): Grade {
    return this._grade;
  }

  public set grade(value: Grade) {
    this._grade = value;
  }

  public get matter(): Matter {
    return this._matter;
  }

  public set matter(value: Matter) {
    this._matter = value;
  }
}
