import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card, Student } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import { LoadingService, UtilsService, GroupService, AlertService, CollectionService, SchoolService } from '../../shared/services/index';
import { CreateCardComponent } from '../createCard/createCard';
import { DeleteCardComponent } from '../deleteCard/deleteCard';
import { FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';




@Component({
  // selector: 'app-collections',
  templateUrl: './collection.html',
  styleUrls: ['./collection.scss']
})
// Pagina de cromos de una colección de un profesor
export class CollectionComponent implements OnInit {
  myControl = new FormControl();
  isTeacher = false;
  public cardSelected: string;
  public optionType: string;
  public groupSelected: string;
  public studentSelected: string;
  public returnUrl: string;
  public result: number;
  public count: number;
  public collectionCards: Array<Card>;
  public collectionGroups: Array<Group>;
  public collectionStudents: Array<Student>;
  public cardId: string;
  public sub: any;
  public collectionCardId: string;
  public myCollection: CollectionCard;
  public cards = [];

  public options = [];

  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public collectionService: CollectionService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {



    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/collection';

    this.sub = this.route.params.subscribe(params => {
      this.collectionCardId = params['id'];


    });


    // Tipos de asignación de cromos a estudiantes
    this.options.push(this.translateService.instant('CARDS.ASSIGNMENTTYPE1'));
    this.options.push(this.translateService.instant('CARDS.ASSIGNMENTTYPE2'));
    this.options.push(this.translateService.instant('CARDS.ASSIGNMENTTYPE3'));
    this.options.push(this.translateService.instant('CARDS.ASSIGNMENTTYPE4'));


    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
      // Obtenemos elobjeto colección a partir del id de la misma
      this.collectionService.getCollection(+this.collectionCardId).subscribe(
        ((collection: CollectionCard) => {
          this.myCollection = collection;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      // Obtenemos los cromos creados de la colección
      this.collectionService.getCollectionDetails(this.collectionCardId).subscribe(
        ((collectionCards: Array<Card>) => {
          this.collectionCards = collectionCards;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      // Grupos que tienen asignados esta colección
      this.collectionService.getAssignedGroups(this.collectionCardId).subscribe(
        ((groups: Array<Group>) => {
          this.collectionGroups = groups;
          this.loadingService.hide();




        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

    }

  }



  public createCard() {

    // Abrir ventana de crear nuevo cromo
    const dialogRef = this.dialog.open(CreateCardComponent, {
      height: '600px',
      width: '800px',
      data: { name: this.collectionCardId }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.result = result;
      this.ngOnInit();
    });

  }
  public deleteCard() {
    // Eliminar cromo
    if (!this.cardId) {
      this.alertService.show(this.translateService.instant('CARDS.NOTSELECTED'));
    } else {

      const dialogRef = this.dialog.open(DeleteCardComponent, {
        height: '600px',
        width: '800px',
        data: { name: this.cardId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.result = result;
        this.cardId = null;
        this.ngOnInit();
      });
    }

  }
  public showStudents() {
    // Mostrar estudiantes de alguno de los grupos que
    // tienen asignados esta colección para
    // asignarle cromos

    if (this.groupSelected) {

      this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
        ((students: Array<Student>) => {
          this.collectionStudents = students;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

    }
  }
  public assignCardsToStudent() {

    // Assignar cromos al estudiante
    if (this.optionType) {
      switch (this.optionType) {
        case this.translateService.instant('CARDS.ASSIGNMENTTYPE1'):
          if (this.studentSelected && this.cardSelected && this.groupSelected) {
            this.collectionService.assignCardToStudent(this.studentSelected, this.cardSelected).subscribe(
              ((collectionCards: Array<Card>) => {
                this.loadingService.hide();

                this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));


              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));
          } else {
            this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'))

          }

          break;
        case this.translateService.instant('CARDS.ASSIGNMENTTYPE2'):

          if (this.studentSelected && this.groupSelected) {


            const numcard = this.randomNumber(1, this.collectionCards.length - 1);
            this.snackbar.open(String(numcard) + '/' + String(this.count));

            this.collectionService.assignCardToStudent(this.studentSelected, numcard).subscribe(
              ((collectionCards: Array<Card>) => {
                this.loadingService.hide();



              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));




            this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));


          } else {
            this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
          }
          break;
        case this.translateService.instant('CARDS.ASSIGNMENTTYPE3'):

          if (this.studentSelected && this.groupSelected) {

            for (let i = 0; i < 3; i++) {

              const numcard = this.randomNumber(1, this.collectionCards.length - 1);

              this.collectionService.assignCardToStudent(this.studentSelected, numcard).subscribe(
                ((collectionCards: Array<Card>) => {
                  this.loadingService.hide();



                }),
                ((error: Response) => {
                  this.loadingService.hide();
                  this.alertService.show(error.toString());
                }));



            }
            this.alertService.show(this.translateService.instant('CARDS.CORASSIGN'));


          } else {
            this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
          }
          break;

        case this.translateService.instant('CARDS.ASSIGNMENTTYPE4'):


          if (this.studentSelected && this.groupSelected) {
            for (let i = 0; i < 5; i++) {
              const numcard = this.randomNumber(1, this.collectionCards.length - 1);

              this.collectionService.assignCardToStudent(this.studentSelected, +numcard).subscribe(
                ((collectionCards: Array<Card>) => {
                  this.loadingService.hide();
                  this.count++;
                }),
                ((error: Response) => {
                  this.loadingService.hide();
                  this.alertService.show(error.toString());
                }));
            }
            this.alertService.show(this.translateService.instant('CARDS.CORASSIGN'));
          } else {
            this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
          }
          break;
      }

      this.groupSelected = '';
      this.studentSelected = '';
      this.optionType = '';
    } else {
      this.alertService.show(this.translateService.instant('CARDS.CHOOSEASSIGN'));


    }
  }
  // Creación de un numero random para  asignar cromos aletorios
  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

}
