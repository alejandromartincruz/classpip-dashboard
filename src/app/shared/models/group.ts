import { Grade } from './grade';
import { Matter } from './matter';
import { Teacher } from './teacher';
import { Student } from './student';

export class Group {

  private _id: string;
  private _name: string;
  private _gradeId: number;
  private _matterId: number;
  private _teacherId: number;
  private _matters: Matter;
  private _grades: Grade;
  private _matter: Matter;
  private _grade: Grade;
  private _teachers: Teacher;
  private _schoolId: number;
  private _students: Student[];

  constructor(id?: string, name?: string, gradeId?: number, matterId?: number,
    matters?: Matter, grades?: Grade, matter?: Matter, grade?: Grade, schoolId?: number, teacherId?: number) {
    this._id = id;
    this._name = name;
    this._gradeId = gradeId;
    this._matterId = matterId;
    this._teacherId = teacherId;
    this._matters = matters;
    this._grades = grades;
    this._matter = matter;
    this._grade = grade;
    this._schoolId = schoolId;
  }

  /* tslint:disable */
  static toObject(object: any): Group {
    /* tslint:enable */
    const result: Group = new Group();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.gradeId = object.gradeId;
      result.matterId = object.matterId;
      result.teacherId = object.teacherId;
      result.grades = object.grades;
      result.matters = object.matters;
      result.grade = object.grade;
      result.matter = object.matter;
      result.teachers = object.teachers;
      result.schoolId = object.schoolId;
      result.students = object.students;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Group> {
    /* tslint:enable */
    const resultArray: Array<Group> = new Array<Group>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Group.toObject(object[i]));
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

  public get gradeId(): number {
    return this._gradeId;
  }

  public set gradeId(value: number) {
    this._gradeId = value;
  }

  public get matterId(): number {
    return this._matterId;
  }

  public set matterId(value: number) {
    this._matterId = value;
  }

  public get teacherId(): number {
    return this._teacherId;
  }

  public set teacherId(value: number) {
    this._teacherId = value;
  }

  public get matters(): Matter {
    return this._matters;
  }

  public set matters(value: Matter) {
    this._matters = value;
  }

  public get grades(): Grade {
    return this._grades;
  }

  public set grades(value: Grade) {
    this._grades = value;
  }

  public get matter(): Matter {
    return this._matter;
  }

  public set matter(value: Matter) {
    this._matter = value;
  }

  public get grade(): Grade {
    return this._grade;
  }

  public set grade(value: Grade) {
    this._grade = value;
  }

  public get teachers(): Teacher {
    return this._teachers;
  }

  public set teachers(value: Teacher) {
    this._teachers = value;
  }

  public get students(): Student[] {
    return this._students;
  }

  public set students(value: Student[]) {
    this._students = value;
  }

  public get schoolId(): number {
    return this._schoolId;
  }

  public set schoolId(value: number) {
    this._schoolId = value;
  }

}
