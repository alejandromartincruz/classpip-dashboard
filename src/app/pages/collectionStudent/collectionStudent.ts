import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card, Student } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import {
  LoadingService, UtilsService, BadgeService, GroupService,
  AlertService, CollectionService, SchoolService
} from '../../shared/services/index';
import { CreateCardComponent } from '../createCard/createCard';
import { DeleteCardComponent } from '../deleteCard/deleteCard';
import { FormControl } from '@angular/forms';
import { TranslateService } from 'ng2-translate';


import { ViewCardComponent } from '../viewcard/viewcard';


@Component({
  //selector: 'app-collections',
  templateUrl: './collectionStudent.html',
  styleUrls: ['./collectionStudent.scss']
})
export class CollectionStudentComponent implements OnInit {
  myControl = new FormControl();
  isTeacher: boolean = false;
  public cardSelected: string;
  public optionType: string;
  public groupSelected: string;
  public studentSelected: string;
  public returnUrl: string;
  public result: number;
  public collection: CollectionCard;
  public collectionCards: Array<Card>;
  public assignedCards: Array<Card>;
  public cards: Array<Card>;
  public badgeWon: Badge = new Badge();

  public finalCards: Array<Card> = new Array<Card>();

  public collectionGroups: Array<Group>;
  public collectionStudents: Array<Student>;
  public cardId: string;

  public sub: any;
  public collectionCardId: string;
  public assignedCardsIds = [];
  public myCards: number;

  public selectedCardId: string;

  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public badgeService: BadgeService,
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrlStudent'] || '/collectionStudent';

    this.sub = this.route.params.subscribe(params => {
      this.collectionCardId = params['id'];
    });

    this.collectionService.getCollection(+this.collectionCardId).subscribe(
      ((collection: CollectionCard) => {
        this.collection = collection;
        this.loadingService.hide();

        if (this.collection.badgeId) {
          this.badgeService.getBadge(+this.collection.badgeId).subscribe(
            ((badgeWon: Badge) => {
              this.badgeWon = badgeWon;
              this.loadingService.hide();


            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));


        }

      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));


    this.collectionService.getCollectionDetails(this.collectionCardId).subscribe(
      ((collectionCards: Array<Card>) => {
        this.collectionCards = collectionCards;
        this.loadingService.hide();


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    this.collectionService.getCollectionDetails(this.collectionCardId).subscribe(
      ((value: Array<Card>) => {
        let allCards: Array<Card> = value;
        this.cards = allCards.sort((n1, n2) => +n1.id - +n2.id)
        let unknownCard = new Card();

        unknownCard.name = this.translateService.instant('CARDS.UNKNOWN');
        unknownCard.rank = this.translateService.instant('CARDS.UNKNOWN');
        unknownCard.image = "https://image.flaticon.com/icons/png/512/37/37232.png";
        this.collectionService.getAssignedCards().subscribe((assignedCards: Array<Card>) => {
          this.assignedCards = assignedCards;
          this.assignedCards.forEach((assignedCard) => {
            this.assignedCardsIds.push(assignedCard.id);
          });
          this.myCards = 0;
          this.cards.forEach((allCard) => {
            if (this.assignedCardsIds.indexOf(allCard.id) == -1) {
              this.finalCards.push(unknownCard);
            }
            else {
              this.finalCards.push(allCard);
              this.myCards++;
            }
          });

        });




      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



  }
  public showcard(selectedCardId: string) {
    const dialogRef = this.dialog.open(ViewCardComponent, {
      height: '700px',
      width: '800px',
      data: { selectedCardId: selectedCardId, collectionCardId: this.collectionCardId }
    });
  }

}
