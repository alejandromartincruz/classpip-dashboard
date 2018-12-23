export class Reward {

  private _id: string;
  private _points: number;
  private _points_obj: string;
  private _badges_obj: string;
  private _level: number;
  private _next_level_points: number;
  private _rank: string;

  constructor(
    points_obj?: string,
    badges_obj?: string,
    points?: number,
    level?: number,
    next_level_points?: number,
    rank?: string
  ) {
    this._points_obj = points_obj;
    this._badges_obj = badges_obj;
    this._points = points;
    this._level = level;
    this._next_level_points = next_level_points;
    this._rank = rank;
  }

  /* tslint:disable */
  static toObject(object: any): Reward {
    /* tslint:enable */
    const result: Reward = new Reward();
    if (object != null) {
      result.id = object.id;
      result.points_obj = object.points_obj;
      result.badges_obj = object.badges_obj;
      result.points = object.points;
      result.level = object.level;
      result.next_level_points = object.next_level_points;
      result.rank = object.rank;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Reward> {
    /* tslint:enable */
    const resultArray: Array<Reward> = new Array<Reward>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Reward.toObject(object[i]));
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

  public get points_obj(): string {
    return this._points_obj;
  }

  public set points_obj(value: string) {
    this._points_obj = value;
  }

  public get badges_obj(): string {
    return this._badges_obj;
  }

  public set badges_obj(value: string) {
    this._badges_obj = value;
  }

  public get points(): number {
    return this._points;
  }

  public set points(value: number) {
    this._points = value;
  }

  public get level(): number {
    return this._level;
  }

  public set level(value: number) {
    this._level = value;
  }

  public get next_level_points(): number {
    return this._next_level_points;
  }

  public set next_level_points(value: number) {
    this._next_level_points = value;
  }

  public get rank(): string {
    return this._rank;
  }

  public set rank(value: string) {
    this._rank = value;
  }

}
