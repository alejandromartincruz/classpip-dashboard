export class Avatar {

  private _id: string;
  private _name: string;
  private _image: string;

  constructor(id?: string, name?: string, image?: string) {
    this._id = id;
    this._name = name;
    this._image = image;
  }

  /* tslint:disable */
  static toObject(object: any): Avatar {
    /* tslint:enable */
    const result: Avatar = new Avatar();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.image = object.image;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Avatar> {
    /* tslint:enable */
    const resultArray: Array<Avatar> = new Array<Avatar>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Avatar.toObject(object[i]));
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

  public set image(value: string) {
    this._image = value;
  }

}
