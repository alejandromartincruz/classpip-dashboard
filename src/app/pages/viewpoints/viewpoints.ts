import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, PointRelation, ResultPoints, Point, Badge, BadgeRelation } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, PointService, GroupService, PointRelationService, BadgeRelationService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './viewpoints.html',
  styleUrls: ['./viewpoints.scss']
})
export class ViewPointsComponent implements OnInit {


  public name: string;
  public value: number;
  public studentId: string;
  public totalPoints: number;
  public badges: Array<Badge>;
  public selectedGroup: string;
  public groupId: string;
  public isStudent: boolean;
  public mygroups: Array<Group>;
  public studentBadges: Array<BadgeRelation> = new Array<BadgeRelation>();
  public listPoints: Array<ResultPoints>; // Student points list
  public studentPoints: Array<PointRelation> = new Array<PointRelation>(); // List of PointRelation of Student

  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public pointRelationService: PointRelationService,
    public pointService: PointService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<ViewPointsComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.studentId = data.studentId;
    this.selectedGroup = data.selectedGroup;
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

    this.listPoints = new Array<ResultPoints>();
    this.pointRelationService.getStudentPoints(String(this.studentId)).subscribe(
      ((studentPoints: Array<PointRelation>) => {
        this.studentPoints = studentPoints;
        this.loadingService.hide();
        for (let relpoint of this.studentPoints) {
          this.pointService.getPoint(+relpoint.pointId).subscribe(
            ((value: Point) => {
              // this.loadingService.hide();
              if (relpoint.groupId.toString() == this.selectedGroup) {
                this.listPoints.push(new ResultPoints(relpoint, value))
                this.totalPoints += Number(value.value) * Number(relpoint.value);
              }
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

