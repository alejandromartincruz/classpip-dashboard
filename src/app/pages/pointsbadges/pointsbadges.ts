import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule } from '@angular/forms';

import {
  Login, Group, Role,
  Questionnaire, ResultPoints, Point,
  Badge, Student, PointRelation,
  BadgeRelation, ResultBadges
} from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import {
  LoadingService, UtilsService, BadgeRelationService,
  GroupService, AlertService, PointRelationService,
  PointService, BadgeService, SchoolService
} from '../../shared/services/index';
import { CreatePointComponent } from '../../pages/createPoint/createPoint';
import { DeletePointComponent } from '../../pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from '../../pages/createBadge/createBadge';
import { DeleteBadgeComponent } from '../../pages/deleteBadge/deleteBadge';
import { TranslateService } from 'ng2-translate';



@Component({
  selector: 'app-pointsbadges',
  templateUrl: './pointsbadges.html',
  styleUrls: ['./pointsbadges.scss']
})
export class PointsBadgesComponent implements OnInit {
  myControl = new FormControl();
  public returnUrl: string;
  public questionnairePoint: string = "100001";
  public badges: Array<Badge>;
  public badgeId: string;
  public resultDeleteBadge: number;
  public isTeacher: boolean;
  public point: Point;

  public mygroups: Array<Group>;
  public mystudents: Array<Student>;
  public groupSelected: string;
  public groupSelectedList: string;
  public studentSelected: string;
  public groupSelected2: string;
  public studentSelected2: string;
  public pointSelected: string;
  public badgeSelected: string;
  public valueSelected: number;
  public points: Array<Point>;
  public studentPoints: Array<PointRelation> = new Array<PointRelation>();
  public valuePoints: Array<PointRelation> = new Array<PointRelation>();
  public studentBadges: Array<BadgeRelation> = new Array<BadgeRelation>();

  public listStudents: Array<Student> = new Array<Student>();
  public listStudentsPoints: Array<Student> = new Array<Student>();


  public listPoints: Array<ResultPoints>;
  public listBadges: Array<ResultBadges>;

  public pointId: string;
  public resultDeletePoint: number;
  public totalPoints: number;
  public totalPointsStudent: number;

  public responsePointRelation: PointRelation;
  public responseBadgeRelation: BadgeRelation;
  public stu: Student;

  public resultCreate: string;

  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public groupService: GroupService,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointRelationService: PointRelationService,
    public badgeRelationService: BadgeRelationService,
    public pointService: PointService,
    public badgeService: BadgeService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
    this.totalPoints = 0;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/pointsbadges';

    if (this.utilsService.role == Role.STUDENT) {
      this.listPoints = new Array<ResultPoints>();
      this.listBadges = new Array<ResultBadges>();

      //Obtenemos los puntos del estudiante
      this.pointRelationService.getStudentPoints(String(this.utilsService.currentUser.userId)).subscribe(
        ((studentPoints: Array<PointRelation>) => {
          this.studentPoints = studentPoints;
          this.loadingService.hide();

          for (let relpoint of this.studentPoints) {
            this.pointService.getPoint(+relpoint.pointId).subscribe(
              ((value: Point) => {
                //this.loadingService.hide();

                this.totalPoints += Number(value.value) * Number(relpoint.value);

                this.listPoints.push(new ResultPoints(relpoint, value))

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


      // Obtenemos las insígnias del estudiante
      this.badgeRelationService.getStudentBadges(String(this.utilsService.currentUser.userId)).subscribe(
        ((studentBadges: Array<BadgeRelation>) => {
          this.studentBadges = studentBadges;
          this.loadingService.hide();

          for (const relbadge of this.studentBadges) {
            this.badgeService.getBadge(+relbadge.badgeId).subscribe(
              ((badge: Badge) => {
                // this.loadingService.hide();
                this.listBadges.push(new ResultBadges(relbadge, badge));
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


    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;

      this.groupService.getMyGroups().subscribe(
        ((mygroups: Array<Group>) => {
          this.mygroups = mygroups;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));



      this.schoolService.getMySchoolBadges().subscribe(
        ((badges: Array<Badge>) => {
          this.badges = badges;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      this.schoolService.getMySchoolPoints().subscribe(
        ((points: Array<Point>) => {
          this.points = points;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));


    }

  }
  public showStudents() {

    this.listStudentsPoints = [];

    if (this.groupSelectedList) {
      this.groupService.getMyGroupStudents(this.groupSelectedList).subscribe(
        ((students: Array<Student>) => {
          this.listStudents = students;
          this.loadingService.hide();

          for (const st of this.listStudents) {
            this.pointRelationService.getStudentPoints(st.id).subscribe(
              ((valuePoints: Array<PointRelation>) => {
                this.valuePoints = valuePoints;
                this.totalPointsStudent = 0;
                st.totalPoints = 0;
                this.loadingService.hide();
                for (const rel of this.valuePoints) {
                  this.pointService.getPoint(rel.pointId).subscribe(
                    ((valuep: Point) => {
                      this.loadingService.hide();

                      // this.totalPointsStudent += Number(valuep.value) * Number(rel.value);
                      st.totalPoints += Number(valuep.value) * Number(rel.value);

                    }),
                    ((error: Response) => {
                      this.loadingService.hide();
                      this.alertService.show(error.toString());
                    }));


                }

                // st.totalPoints = this.totalPointsStudent;

                // st.totalPoints = this.totalPointsStudent;

                this.listStudentsPoints.push(st);
                this.totalPointsStudent = 0;

              }
              ),
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
    }



  }
  public openStudents() {


    if (this.groupSelected) {
      this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
        ((mystudents: Array<Student>) => {
          this.mystudents = mystudents;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }

  }
  public openStudents2() {


    if (this.groupSelected2) {
      this.groupService.getMyGroupStudents(this.groupSelected2).subscribe(
        ((mystudents: Array<Student>) => {
          this.mystudents = mystudents;
          this.loadingService.hide();


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }

  }
  sendBadgeRelation() {


    if (!this.groupSelected2 || !this.studentSelected2 || !this.badgeSelected) {

      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));

    }
    else {
      this.badgeRelationService.postBadgeRelation(this.badgeSelected, this.studentSelected2, this.utilsService.currentSchool.id, this.groupSelected2, 1).subscribe(
        ((responseBadgeRelation: BadgeRelation) => {
          this.responseBadgeRelation = responseBadgeRelation;
          this.loadingService.hide();

          this.alertService.show(this.translateService.instant('BADGES.CORASSIGN'));


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  sendPointRelation() {
    if (!this.groupSelected || !this.studentSelected || !this.pointSelected || !this.valueSelected) {

      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));

    }
    else {
      this.pointRelationService.postPointRelation(this.pointSelected, this.studentSelected, this.utilsService.currentSchool.id, this.groupSelected, this.valueSelected).subscribe(
        ((responsePointRelation: PointRelation) => {
          this.responsePointRelation = responsePointRelation;
          this.loadingService.hide();

          this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));


        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  public createPoint() {
    const dialogRef = this.dialog.open(CreatePointComponent, {
      height: '600px',
      width: '700px',
    });



    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }
  public deletePoint() {


    if (!this.pointId) {

      this.alertService.show(this.translateService.instant('POINTS.NOTSELECTED'));

    }
    else if (this.pointId == this.questionnairePoint) {
      this.alertService.show(this.translateService.instant('POINTS.QUESTIONNAIRE'));


    }
    else {
      let dialogRef = this.dialog.open(DeletePointComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.pointId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeletePoint = result;
        this.pointId = null
        this.ngOnInit();
      });
    }


  }

  public createBadge() {
    const dialogRef = this.dialog.open(CreateBadgeComponent, {
      height: '600px',
      width: '700px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.resultCreate = result;
      this.ngOnInit();
    });
  }
  public deleteBadge() {

    if (!this.badgeId) {

      this.alertService.show(this.translateService.instant('BADGES.NOTSELECTED'));


    }

    else {
      let dialogRef = this.dialog.open(DeleteBadgeComponent, {
        height: '400px',
        width: '600px',
        data: { name: this.badgeId }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.resultDeleteBadge = result;
        this.badgeId = null

        this.ngOnInit();
      });
    }


  }


}
