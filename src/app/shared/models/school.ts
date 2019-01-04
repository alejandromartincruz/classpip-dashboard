import { Teacher } from './teacher';
import { Student } from './student';

export class School {

  private _id: string;
  private _name: string;
  private _address: string;
  private _image: string;
  private _zipCode: string;
  private _city: string;
  private _country: string;
  private _cif: string;
  private _phone: string;
  private _latitude: number;
  private _longitude: number;
  private _imageBig: string;
  private _facebook: string;
  private _twitter: string;
  private _description: string;
  private _website: string;
  private _teachers: Teacher[];
  private _students: Student[];

  constructor(id?: string, name?: string, address?: string, image?: string,
    zipCode?: string, city?: string, country?: string, cif?: string,
    phone?: string, latitude?: number, longitude?: number, imageBig?: string,
    facebook?: string, twitter?: string, description?: string,
    website?: string) {
    this._id = id;
    this._name = name;
    this._address = address;
    this._image = image;
    this._zipCode = zipCode;
    this._city = city;
    this._country = country;
    this._cif = cif;
    this._phone = phone;
    this._latitude = latitude;
    this._longitude = longitude;
    this._imageBig = imageBig;
    this._facebook = facebook;
    this._twitter = twitter;
    this._description = description;
    this._website = website;
  }

  /* tslint:disable */
  static toObject(object: any): School {
    /* tslint:enable */
    const result: School = new School();
    if (object != null) {
      result.id = object.id;
      result.name = object.name;
      result.address = object.address;
      result.image = object.image;
      result.zipCode = object.zipCode;
      result.city = object.city;
      result.country = object.country;
      result.cif = object.cif;
      result.phone = object.phone;
      result.latitude = object.latitude;
      result.longitude = object.longitude;
      result.imageBig = object.imageBig;
      result.facebook = object.facebook;
      result.twitter = object.twitter;
      result.description = object.description;
      result.website = object.website;
      result.teachers = object.teachers;
      result.students = object.students;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<School> {
    /* tslint:enable */
    const resultArray: Array<School> = new Array<School>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(School.toObject(object[i]));
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

  public get address(): string {
    return this._address;
  }

  public set address(value: string) {
    this._address = value;
  }

  public get image(): string {
    return this._image;
  }

  public set image(value: string) {
    this._image = value;
  }

  public get zipCode(): string {
    return this._zipCode;
  }

  public set zipCode(value: string) {
    this._zipCode = value;
  }

  public get city(): string {
    return this._city;
  }

  public set city(value: string) {
    this._city = value;
  }

  public get country(): string {
    return this._country;
  }

  public set country(value: string) {
    this._country = value;
  }

  public get cif(): string {
    return this._cif;
  }

  public set cif(value: string) {
    this._cif = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get latitude(): number {
    return this._latitude;
  }

  public set latitude(value: number) {
    this._latitude = value;
  }

  public get longitude(): number {
    return this._longitude;
  }

  public set longitude(value: number) {
    this._longitude = value;
  }

  public get imageBig(): string {
    return this._imageBig;
  }

  public set imageBig(value: string) {
    this._imageBig = value;
  }

  public get facebook(): string {
    return this._facebook;
  }

  public set facebook(value: string) {
    this._facebook = value;
  }

  public get twitter(): string {
    return this._twitter;
  }

  public set twitter(value: string) {
    this._twitter = value;
  }

  public get description(): string {
    return this._description;
  }

  public set description(value: string) {
    this._description = value;
  }

  public get website(): string {
    return this._website;
  }

  public set website(value: string) {
    this._website = value;
  }

  public get teachers(): Teacher[] {
    return this._teachers;
  }

  public set teachers(value: Teacher[]) {
    this._teachers = value;
  }

  public get students(): Student[] {
    return this._students;
  }

  public set students(value: Student[]) {
    this._students = value;
  }

}
