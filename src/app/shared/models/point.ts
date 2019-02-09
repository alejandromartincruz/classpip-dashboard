export class Point {

  private _id: string;
  private _name: string;
  private _value: number;
  private _image: string;
  private _schoolId: number;
  private _teacherId: number;


  constructor(id?: string, name?: string, value?: number, image?: string, schoolId?: number,
    teacherId?: number) {
    this._id = id;
    this._name = name;
    this._value = value;
    this._image = image;


  }

  /* tslint:disable */
  static toObject(object: any): Point {
    /* tslint:enable */
    const result: Point = new Point();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.value = object.value;
      result.image = object.image;

    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Point> {
    /* tslint:enable */
    const resultArray: Array<Point> = new Array<Point>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Point.toObject(object[i]));
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

  public get image(): string {
    return this._image;
  }

  public set image(image: string) {
    this._image = image;
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

}
