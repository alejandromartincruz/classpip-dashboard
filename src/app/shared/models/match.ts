export class Match {

  private _id: string;
  private _playerOne: number;
  private _playerTwo: number;
  private _winner: number;
  private _journeyId: number;
  private _namePlayerOne: string;
  private _namePlayerTwo: string;
  private _result: string;

  constructor(id?: string, playerOne?: number, playerTwo?: number, winner?: number, journeyId?: number,
  namePlayerOne?: string, namePlayerTwo?: string, result?: string) {
    this._id = id;
    this._playerOne = playerOne;
    this._playerTwo = playerTwo;
    this._winner = winner;
    this._journeyId = journeyId;
    this._namePlayerOne = namePlayerOne;
    this._namePlayerTwo = namePlayerTwo;
    this._result = result;
  }

  /* tslint:disable */
  static toObject(object: any): Match {
    /* tslint:enable */
    const result: Match = new Match();
    if (object != null) {
      result.id = object.id;     /* result.id  no me dara error en .id, .name, .type, etc cuando lo defina en set*/
      result.playerOne = object.playerOne;
      result.playerTwo = object.playerTwo;
      result.winner = object.winner;
      result.journeyId = object.journeyId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Match> {
    /* tslint:enable */
    const resultArray: Array<Match> = new Array<Match>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Match.toObject(object[i]));
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

  public get playerOne(): number {
    return this._playerOne;
  }

  public set playerOne(value: number) {
    this._playerOne = value;
  }

  public get playerTwo(): number {
    return this._playerTwo;
  }

  public set playerTwo(value: number) {
    this._playerTwo = value;
  }

  public get winner(): number {
    return this._winner;
  }

  public set winner(value: number) {
    this._winner = value;
  }

  public get journeyId(): number {
    return this._journeyId;
  }

  public set journeyId(value: number) {
    this._journeyId = value;
  }
  public get namePlayerOne(): string {
    return this._namePlayerOne;
  }

  public set namePlayerOne(value: string) {
    this._namePlayerOne = value;
  }
  public get namePlayerTwo(): string {
    return this._namePlayerTwo;
  }

  public set namePlayerTwo(value: string) {
    this._namePlayerTwo = value;
  }
  public get result(): string {
    return this._result;
  }

  public set result(value: string) {
    this._result = value;
  }
}
