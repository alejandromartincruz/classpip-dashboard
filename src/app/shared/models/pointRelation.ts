import { Student } from './student';
import { Point } from './point';

export class PointRelation {

  private _id: string;
  private _value: number;
  private _pointId: number;
  private _groupId: number;
  private _studentId: number;
  private _schoolId: number;
  private _student: Student;
  private _point: Point;

  constructor(value?: number, pointId?: number, groupId?: number, studentId?: number, schoolId?: number) {
    this._value = value;
    this._pointId = pointId;
    this._groupId = groupId;
    this._studentId = studentId;
    this._schoolId = schoolId;
  }

  /* tslint:disable */
  static toObject(object: any): PointRelation {
    /* tslint:enable */
    const result: PointRelation = new PointRelation();
    if (object != null) {
      result.id = object.id;
      result.value = object.value;
      result.pointId = object.pointId;
      result.groupId = object.groupId;
      result.studentId = object.studentId;
      result.schoolId = object.schoolId;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<PointRelation> {
    /* tslint:enable */
    const resultArray: Array<PointRelation> = new Array<PointRelation>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(PointRelation.toObject(object[i]));
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

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get pointId(): number {
    return this._pointId;
  }

  public set pointId(value: number) {
    this._pointId = value;
  }

  public get groupId(): number {
    return this._groupId;
  }

  public set groupId(value: number) {
    this._groupId = value;
  }

  public get studentId(): number {
    return this._studentId;
  }

  public set studentId(value: number) {
    this._studentId = value;
  }

  public get schoolId(): number {
    return this._schoolId;
  }

  public set schoolId(value: number) {
    this._schoolId = value;
  }

  public get student(): Student {
    return this._student;
  }

  public set student(value: Student) {
    this._student = value;
  }

  public get point(): Point {
    return this._point;
  }

  public set point(value: Point) {
    this._point = value;
  }

}
