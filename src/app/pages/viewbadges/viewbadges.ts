import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, ResultBadges, Point, Badge, BadgeRelation } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, PointService, GroupService, BadgeService, BadgeRelationService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './viewbadges.html',
  styleUrls: ['./viewbadges.scss']
})
export class ViewBadgesComponent implements OnInit {


  public name: string;
  public value: number;
  public studentId: string;
  public badges: Array<Badge>;
  public groupId: string;
  public isStudent: boolean;
  public mygroups: Array<Group>;
  public studentBadges: Array<BadgeRelation> = new Array<BadgeRelation>();
  public listBadges: Array<ResultBadges>;
  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public pointService: PointService,
    public badgeRelationService: BadgeRelationService,
    public badgeService: BadgeService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ViewBadgesComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.studentId = data.studentId;
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
    this.groupService.getMyGroups().subscribe(
      ((mygroups: Array<Group>) => {
        this.mygroups = mygroups;
        this.loadingService.hide();


      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    this.listBadges = new Array<ResultBadges>();
    //Obtenemos las insígnias del estudiante
    this.badgeRelationService.getStudentBadges(String(this.studentId)).subscribe(
      ((studentBadges: Array<BadgeRelation>) => {
        this.studentBadges = studentBadges;
        this.loadingService.hide();

        for (let relbadge of this.studentBadges) {
          this.badgeService.getBadge(+relbadge.badgeId).subscribe(
            ((badge: Badge) => {
              //this.loadingService.hide();



              this.listBadges.push(new ResultBadges(relbadge, badge))

            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }
      }
      ),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));


  }

  cancel(): void {
    this.dialogRef.close();
  }
}

