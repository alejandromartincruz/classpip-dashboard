export class Team {

  private _id: string;
  private _name: string;
  private _numPlayers: number;
  private _groupId: number;

  constructor(id?: string, name?: string, numPlayers?: number, groupId?: number) {
    this._id = id;
    this._name = name;
    this._numPlayers = numPlayers;
    this._groupId = groupId;
  }

  /* tslint:disable */
  static toObject(object: any): Team {
    /* tslint:enable */
    const result: Team = new Team();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.numPlayers = object.numPlayers;
      result.groupId = object.groupId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Team> {
    /* tslint:enable */
    const resultArray: Array<Team> = new Array<Team>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Team.toObject(object[i]));
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

  public get numPlayers(): number {
    return this._numPlayers;
  }

  public set numPlayers(value: number) {
    this._numPlayers = value;
  }

  public get groupId(): number {
    return this._groupId;
  }

  public set groupId(value: number) {
    this._groupId = value;
  }
}
