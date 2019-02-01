export class Matter {

  private _id: string;
  private _name: string;
  private _schoolId: number;
  private _gradeId: number;

  constructor(id?: string, name?: string, schoolId?: number, gradeId?: number) {
    this._id = id;
    this._name = name;
    this._schoolId = schoolId;
    this._gradeId = gradeId;
  }

  /* tslint:disable */
  static toObject(object: any): Matter {
    /* tslint:enable */
    const result: Matter = new Matter();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.schoolId = object.schoolId;
      result.gradeId = object.gradeId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Matter> {
    /* tslint:enable */
    const resultArray: Array<Matter> = new Array<Matter>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Matter.toObject(object[i]));
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

  public get gradeId(): number {
    return this._gradeId;
  }

  public set gradeId(value: number) {
    this._gradeId = value;
  }

}
