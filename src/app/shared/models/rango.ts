export class Rango {

  private _id: string;
  private _puntosRango: number;
  private _nombreRango: string;
  private _imageRangoLink: string;
  private _altImageRangoLink: string;

  constructor(id?: string, nombreRango?: string, puntosRango?: number, imageRangoLink?: string, altImageRangoLink?: string) {
    this._id = id;
    this._nombreRango = nombreRango;
    this._puntosRango = puntosRango;
    this._imageRangoLink = imageRangoLink;
    this._altImageRangoLink = altImageRangoLink;
  }

  /* tslint:disable */
  static toObject(object: any): Rango {
    /* tslint:enable */
    const result: Rango = new Rango();
    if (object != null) {
      result.id = object.id;
      result.nombreRango = object.nombreRango;
      result.puntosRango = object.puntosRango;
      result.imageRangoLink = object.imageRangoLink;
      result.altImageRangoLink = object.altImageRangoLink;
    }
    return result;
  }

  /* tslint:disable */
  static toObjectArray(object: any): Array<Rango> {
    /* tslint:enable */
    const resultArray: Array<Rango> = new Array<Rango>();
    if (object != null) {
      for (let i = 0; i < object.length; i++) {
        resultArray.push(Rango.toObject(object[i]));
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

  public get nombreRango(): string {
    return this._nombreRango;
  }

  public set nombreRango(value: string) {
    this._nombreRango = value;
  }

  public get puntosRango(): number {
    return this._puntosRango;
  }

  public set puntosRango(value: number) {
    this._puntosRango = value;
  }

  public get imageRangoLink(): string {
    return this._imageRangoLink;
  }

  public set imageRangoLink(value: string) {
    this._imageRangoLink = value;
  }

  public get altImageRangoLink(): string {
    return this._altImageRangoLink;
  }

  public set altImageRangoLink(value: string) {
    this._altImageRangoLink = value;
  }

}
