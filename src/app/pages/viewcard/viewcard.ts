import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point, Badge, CollectionCard, Card, Student } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, PointService, GroupService, BadgeService, CollectionService, BadgeRelationService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './viewcard.html',
  styleUrls: ['./viewcard.scss']
})
export class ViewCardComponent implements OnInit {


  public name: string;
  public value: number;
  public studentId: string;
  public selectedCardId: string;
  public badges: Array<Badge>;
  public groupId: string;
  public isStudent: boolean;
  public mygroups: Array<Group>;
  public cardSelected: string;
  public optionType: string;
  public groupSelected: string;
  public studentSelected: string;
  public returnUrl: string;
  public result: number;
  public collection: CollectionCard;
  public collectionCards: Array<Card>;
  public listStudents: Array<Student> = new Array<Student>();
  public assignedCards: Array<Card>;
  public cards: Array<Card>;
  public badgeWon: Badge = new Badge();
  public selectedCard: Card;
  public finalCards: Array<Card> = new Array<Card>();

  public collectionGroups: Array<Group>;
  public collectionStudents: Array<Student>;
  public cardId: string;

  public sub: any;
  public collectionCardId: string;
  public assignedCardsIds = [];
  public myCards: number;
  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public pointService: PointService,
    public collectionService: CollectionService,
    public badgeRelationService: BadgeRelationService,
    public badgeService: BadgeService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ViewCardComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedCardId = data.selectedCardId;
    this.collectionCardId = data.collectionCardId;
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrlStudent'] || '/collectionStudent';
    this.groupService.getMyGroups().subscribe(
      ((mygroups: Array<Group>) => {
        this.mygroups = mygroups;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    // this.sub = this.route.params.subscribe(params => {
    //   this.collectionCardId = params['id'];
    // })
    // this.collectionCardId = "1"; //falta automatizar!!
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
        this.cards.forEach((allCard) => {
          if (allCard.id == this.selectedCardId) {
            this.selectedCard = allCard;
          }
        });
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



  }

  cancel(): void {
    this.dialogRef.close();
  }

  public GetStudents() {
    this.listStudents = [];
    if (this.groupSelected) {
      this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
        ((students: Array<Student>) => {
          this.listStudents = students;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  public sendcard() {
    this.collectionService.deletemycard(this.selectedCardId).subscribe(
      ((collectionCards: Array<Card>) => {
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    // this.studentSelected = "10001"
    this.collectionService.assignCardToStudent(this.studentSelected, this.selectedCardId).subscribe(
      ((collectionCards: Array<Card>) => {
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));



    this.cancel();
    window.location.reload();
    this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
  }
}

