export class Journey {

  private _id: string;
  private _number: number;
  private _date: Date;
  private _competitionId: number;
  private _completed: boolean;

  constructor(id?: string, number?: number, date?: Date, competitionId?: number, completed?: boolean) {
    this._id = id;
    this._number = number;
    this._date = date;
    this._competitionId = competitionId;
    this._completed = completed;
  }

  /* tslint:disable */
  static toObject(object: any): Journey {
    /* tslint:enable */
    const result: Journey = new Journey();
    if (object != null) {
      result.id = object.id;     /* result.id  no me dara error en .id, .name, .type, etc cuando lo defina en set*/
      result.number = object.number;
      result.date = object.date;
      result.competitionId = object.competitionId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Journey> {
    /* tslint:enable */
    const resultArray: Array<Journey> = new Array<Journey>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Journey.toObject(object[i]));
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

  public get number(): number {
    return this._number;
  }

  public set number(value: number) {
    this._number = value;
  }

  public get date(): Date {
    return this._date;
  }

  public set date(value: Date) {
    this._date = value;
  }

  public get competitionId(): number {
    return this._competitionId;
  }

  public set competitionId(value: number) {
    this._competitionId = value;
  }

  public get completed(): boolean {
    return this._completed;
  }

  public set completed(value: boolean) {
    this._completed = value;
  }

}
