export class Mesa {

  private _id: string;
  private _nombreAula: string;
  private _numFila: number;
  private _numColumna: number;
  private _imageM: string;


  constructor(id?: string, nombreAula?: string, numFila?: number, numColumna?: number, imageM?: string) {
    this._id = id;
    this._nombreAula = nombreAula;
    this._numFila = numFila;
    this._numColumna = numColumna;
    this._imageM = imageM;
  }
  /* tslint:disable */
  static toObject(object: any): Mesa {
    /* tslint:enable */
    const result: Mesa = new Mesa();
    if (object != null) {
      result.id = object.id;
      result.nombreAula = object.nombreAula;
      result.numFila = object.numFila;
      result.numColumna = object.numColumna;
      result.imageM = object.imageM;

    }
    return result;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get nombreAula(): string {
    return this._nombreAula;
  }

  public set nombreAula(value: string) {
    this._nombreAula = value;
  }

  public get imageM(): string {
    return this._imageM;
  }

  public set imageM(value: string) {
    this._imageM = value;
  }

  public get numFila(): number {
    return this._numFila;
  }

  public set numFila(value: number) {
    this._numFila = value;
  }

  public get numColumna(): number {
    return this._numColumna;
  }

  public set numColumna(value: number) {
    this._numColumna = value;
  }

}
