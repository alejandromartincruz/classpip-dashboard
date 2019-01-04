import { Avatar } from './avatar';
import { Credentials } from './credentials';

export class Teacher {

  private _id: string;
  private _name: string;
  private _surname: string;
  private _profileImage: string;
  private _username: string;
  private _email: string;
  private _schoolId: number;
  private _avatarId: number;
  private _avatar: Avatar;
  private _credentials: Credentials;

  constructor(name?: string, surname?: string, profileImage?: string, username?: string,
    email?: string, schoolId?: number, avatarId?: number, credentials?: Credentials) {
    this._name = name;
    this._surname = surname;
    this._profileImage = profileImage;
    this._username = username;
    this._email = email;
    this._schoolId = schoolId;
    this._avatarId = avatarId;
    this._credentials = credentials;
  }

  /* tslint:disable */
  static toObject(object: any): Teacher {
    /* tslint:enable */
    const result: Teacher = new Teacher();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.surname = object.surname;
      result.profileImage = object.profileImage;
      result.username = object.username;
      result.email = object.email;
      result.schoolId = object.schoolId;
      result.avatarId = object.avatarId;
      result.credentials = object.credentials;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Teacher> {
    /* tslint:enable */
    const resultArray: Array<Teacher> = new Array<Teacher>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Teacher.toObject(object[i]));
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

  public get surname(): string {
    return this._surname;
  }

  public set surname(value: string) {
    this._surname = value;
  }

  public get profileImage(): string {
    return this._profileImage;
  }

  public set profileImage(value: string) {
    this._profileImage = value;
  }

  public get username(): string {
    return this._username;
  }

  public set username(value: string) {
    this._username = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get schoolId(): number {
    return this._schoolId;
  }

  public set schoolId(value: number) {
    this._schoolId = value;
  }

  public get avatarId(): number {
    return this._avatarId;
  }

  public set avatarId(value: number) {
    this._avatarId = value;
  }

  public get avatar(): Avatar {
    return this._avatar;
  }

  public set avatar(value: Avatar) {
    this._avatar = value;
  }

  public get credentials(): Credentials {
    return this._credentials;
  }

  public set credentials(value: Credentials) {
    this._credentials = value;
  }

}
