import { Matter } from './matter';

export class Grade {

  private _id: string;
  private _name: string;
  private _schoolId: number;
  private _matters: Matter[];

  constructor(id?: string, name?: string, schoolId?: number) {
    this._id = id;
    this._name = name;
    this._schoolId = schoolId;
  }

  /* tslint:disable */
  static toObject(object: any): Grade {
    /* tslint:enable */
    const result: Grade = new Grade();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result._schoolId = object.schoolId;
      result.matters = object.matters;

    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Grade> {
    /* tslint:enable */
    const resultArray: Array<Grade> = new Array<Grade>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Grade.toObject(object[i]));
      }
    }
    return resultArray;
  }

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

  public get schoolId(): number {
    return this._schoolId;
  }

  public set schoolId(value: number) {
    this._schoolId = value;
  }

  public get matters(): Matter[] {
    return this._matters;
  }

  public set matters(value: Matter[]) {
    this._matters = value;
  }

}
