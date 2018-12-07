import { Student } from './student'
import {Teacher} from './teacher'
import { Point } from './point'

export class SelectedGroup {

  private _groupId: number;


  constructor(groupId?: number) {
	  this._groupId = groupId;
  }

  /* tslint:disable */
  static toObject(object: any): SelectedGroup {
    /* tslint:enable */
    let result: SelectedGroup = new SelectedGroup();
    if (object != null) {
	    result.groupId = object.groupId;
    }
    return result;
  }
  public get groupId(): number {
    return this._groupId;
  }

  public set groupId(value: number) {
    this._groupId = value;
  }

}
