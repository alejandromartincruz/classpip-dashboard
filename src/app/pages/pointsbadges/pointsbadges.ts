import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormsModule } from '@angular/forms';

import {
  Login, Group, Role, Questionnaire, ResultPoints, Team,
  Point, Badge, Student, PointRelation, BadgeRelation, ResultBadges
} from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';

import {
  LoadingService, UtilsService, BadgeRelationService,
  GroupService, AlertService, PointRelationService, PointService,
  BadgeService, SchoolService, TeamService
} from '../../shared/services/index';
import { CreatePointComponent } from '../../pages/createPoint/createPoint';
import { DeletePointComponent } from '../../pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from '../../pages/createBadge/createBadge';
import { DeleteBadgeComponent } from '../../pages/deleteBadge/deleteBadge';
import { TranslateService } from 'ng2-translate';
import { ViewBadgesComponent } from '../viewbadges/viewbadges';
import { ViewPointsComponent } from '../viewpoints/viewpoints';



@Component({
  selector: 'app-pointsbadges',
  templateUrl: './pointsbadges.html',
  styleUrls: ['./pointsbadges.scss']
})
export class PointsBadgesComponent implements OnInit {
  myControl = new FormControl();
  public returnUrl: string;
  public isTeacher: boolean;

  // Teams || Individual
  public modeIndividual: boolean;
  public options = [];
  public teammode: boolean = false;
  public groupnoteams: boolean;
  public Teams: Array<Team>;
  public teamSelected: Team;
  public StudentsTeam: Array<Student>;
  public individ: boolean = true;
  // Teacher role
  public points: Array<Point>; // School Points list ready to Send
  public badges: Array<Badge>; // School Badge list ready to Send

  // Student role
  public studentPoints: Array<PointRelation> = new Array<PointRelation>(); // List of PointRelation of Student
  public listPoints: Array<ResultPoints>; // Student points list
  public totalPoints: number;
  public listBadges: Array<ResultBadges>; // Student badges
  public studentBadges: Array<BadgeRelation> = new Array<BadgeRelation>(); // List of BadgeRelation of Student

  // mat select
  public mygroups: Array<Group>; // List of Teacher groups
  public mystudents: Array<Student>; // List of group students
  public collectionTeams: Array<Team>; // List of group teams
  public groupSelected: string; // points group select
  public studentSelected: string; // student selected Points
  public Team: Array<Student>;
  public pointSelected: string; // Point to send
  public badgeSelected: string; // Badge to send
  public valueSelected: number; // Point value send

  // Methods
  // deletePoint()
  public questionnairePoint: string = "100001";
  public badgeId: string;
  public resultDeleteBadge: number;
  public pointId: string;
  public resultDeletePoint: number;
  // showStudents()
  public listStudents: Array<Student> = new Array<Student>();
  public teamslist: Array<Team> = new Array<Team>();

  public listStudentsPoints: Array<Student> = new Array<Student>();
  public valuePoints: Array<PointRelation> = new Array<PointRelation>();
  public totalPointsStudent: number;
  public teams = new Array();
  public scores = new Array<Score>();
  public scoresteam = new Array<ScoreTeam>();
  public scoreteam: ScoreTeam;
  public nullpoints: boolean;
  public puntoss: number;
  public score: Score;
  // SendPointRelation() SendBadgeRelation()
  public responsePointRelation: PointRelation;
  public responseBadgeRelation: BadgeRelation;
  // CreatePoint() CreateBadge()
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
    public teamService: TeamService,
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

    if (this.utilsService.role === Role.STUDENT) {
      this.isTeacher = false;
      this.listPoints = new Array<ResultPoints>();
      this.listBadges = new Array<ResultBadges>();

      // Obtenemos los puntos del estudiante
      this.pointRelationService.getStudentPoints(String(this.utilsService.currentUser.userId)).subscribe(
        ((studentPoints: Array<PointRelation>) => {
          this.studentPoints = studentPoints;
          this.loadingService.hide();
          for (let relpoint of this.studentPoints) {
            this.pointService.getPoint(+relpoint.pointId).subscribe(
              ((value: Point) => {
                // this.loadingService.hide();
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

          for (let relbadge of this.studentBadges) {
            this.badgeService.getBadge(+relbadge.badgeId).subscribe(
              ((badge: Badge) => {
                // this.loadingService.hide();
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

    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
      this.options[0] = this.translateService.instant('COMMON.INDIVIDUAL');
      this.options[1] = this.translateService.instant('COMMON.TEAMS');

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
    } else {
      this.groupService.getMyGroups().subscribe(
        ((mygroups: Array<Group>) => {
          this.mygroups = mygroups;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  public individualorteam() {
    if (this.teammode == true) {
      this.teammode = false;
      this.modeIndividual = true;
      this.individ = true;
    } else {
      this.teammode = true;
      this.individ = false;
      this.modeIndividual = false;
      this.GetTeams();
    }
  }

  GetTeams(): void {
    this.groupService.getGroupTeams(this.groupSelected).subscribe(
      ((teams: Array<Team>) => {
        this.Teams = teams;
        if (this.Teams.length == 0) {
          this.alertService.show(this.translateService.instant('TEAMS.GROUPNOTEAMS'));
          this.groupnoteams = true;
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  GetTeam(): void {
    this.teamService.getStudentsTeam(this.teamSelected.id).subscribe(
      ((students: Array<Student>) => {
        this.StudentsTeam = students;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  public showStudents() {
    if (this.individ && this.groupSelected) {
      this.scores = [];
      this.nullpoints = true;
      this.listStudentsPoints = [];
      if (this.groupSelected) {
        this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
          ((students: Array<Student>) => {
            this.listStudents = students;
            this.loadingService.hide();
            for (let st of this.listStudents) {
              this.pointRelationService.getStudentPoints(st.id).subscribe(
                ((valuePoints: Array<PointRelation>) => {
                  this.valuePoints = valuePoints;
                  this.totalPointsStudent = 0;
                  st.totalPoints = 0;
                  this.puntoss = 0;
                  this.loadingService.hide();
                  for (let rel of this.valuePoints) {
                    if (rel.groupId === +this.groupSelected) {
                      this.pointService.getPoint(rel.pointId).subscribe(
                        ((valuep: Point) => {
                          this.loadingService.hide();
                          st.totalPoints += Number(valuep.value) * Number(rel.value);
                          this.puntoss += Number(valuep.value) * Number(rel.value);
                          if (st.totalPoints !== 0) { this.nullpoints = false; }
                          this.sortstudents();
                        }),
                        ((error: Response) => {
                          this.loadingService.hide();
                          this.alertService.show(error.toString());
                        }));
                    }
                  }
                  this.listStudentsPoints.push(st);
                  this.totalPointsStudent = 0;
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
      }
    } else { this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS')); }

  }

  public sortstudents() {
    if (this.nullpoints === false) {
      this.scores = [];
      for (let st2 of this.listStudentsPoints) {
        this.score = { position: 0, nameees: st2.name.concat(' ', st2.surname), points: 0, currentuser: false, studentId: st2.id };
        this.score.points = st2.totalPoints;
        this.score.position = 0;
        this.scores.push(this.score);
      }
    } else {
      this.scores = [];
      for (let st3 of this.listStudents) {
        this.score = { position: 0, nameees: st3.name.concat(' ', st3.surname), points: 0, currentuser: false, studentId: st3.id };
        this.score.points = 0;
        this.score.position = 0;
        this.scores.push(this.score);
      }
    }
    this.scores.sort(function (a, b) {
      return (b.points - a.points);
    });
    for (let _s = 0; _s < this.scores.length; _s++) {
      this.scores[_s].position = _s + 1;
    }
  }

  public sortteams() {
    this.scoresteam = [];
    for (let team1 of this.teamslist) {
      this.scoreteam = { position: 0, name: team1.name, points: 0 };
      this.scoreteam.points = team1.totalpoints / team1.numPlayers;
      this.scoreteam.position = 0;
      this.scoresteam.push(this.scoreteam);
    }
    this.scoresteam.sort(function (a, b) {
      return (b.points - a.points);
    });
    for (let _s = 0; _s < this.scoresteam.length; _s++) {
      this.scoresteam[_s].position = _s + 1;
    }
  }

  showTeams() {
    this.groupService.getGroupTeams(this.groupSelected).subscribe(
      ((teams: Array<Team>) => {
        this.teamslist = teams;
        this.loadingService.hide();
        for (let tteam of this.teamslist) {
          this.teamService.getStudentsTeam(tteam.id).subscribe(
            ((students: Array<Student>) => {
              this.listStudents = students;
              tteam.numPlayers = this.listStudents.length;
              this.loadingService.hide();
              for (let st of this.listStudents) {
                this.pointRelationService.getStudentPoints(st.id).subscribe(
                  ((valuePoints: Array<PointRelation>) => {
                    this.valuePoints = valuePoints;
                    this.totalPointsStudent = 0;
                    tteam.totalpoints = 0;
                    this.puntoss = 0;
                    this.loadingService.hide();
                    for (let rel of this.valuePoints) {
                      if (rel.groupId === +this.groupSelected) {
                        this.pointService.getPoint(rel.pointId).subscribe(
                          ((valuep: Point) => {
                            this.loadingService.hide();
                            this.puntoss += Number(valuep.value) * Number(rel.value);
                            tteam.totalpoints += Number(valuep.value) * Number(rel.value);
                            this.sortteams();
                          }),
                          ((error: Response) => {
                            this.loadingService.hide();
                            this.alertService.show(error.toString());
                          }));
                      }
                    }
                    this.listStudentsPoints.push(st);
                    this.totalPointsStudent = 0;
                  }),
                  ((error: Response) => {
                    this.loadingService.hide();
                    this.alertService.show(error.toString());
                  }));
              }

            })
          )
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  public showAwards(studentId: string) {
    const dialogRef = this.dialog.open(ViewBadgesComponent, {
      height: '600px',
      width: '700px',
      data: { studentId: studentId }
    });
  }
  public showPoints(studentId: string) {
    const dialogRef = this.dialog.open(ViewPointsComponent, {
      height: '600px',
      width: '700px',
      data: { studentId: studentId, selectedGroup: this.groupSelected }
    });
  }


  public GetStudents() {
    if (this.individ && this.groupSelected) {
      if (this.individ) {
        this.modeIndividual = true;
        this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
          ((mystudents: Array<Student>) => {
            this.mystudents = mystudents;
            this.alertService.show('Individual, ' + this.groupSelected.toString());
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      } else {
        this.modeIndividual = false;
        this.groupService.getGroupTeams(this.groupSelected).subscribe(
          ((teams: Array<Team>) => {
            this.collectionTeams = teams;
            this.alertService.show('Equipos, ' + this.groupSelected.toString());
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }
    }
  }

  public sendBadgeRelation() {

    if (!this.groupSelected || !this.badgeSelected) {
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
    } else {
      if (this.modeIndividual === true && this.studentSelected) {
        this.badgeRelationService.postBadgeRelation(this.badgeSelected, this.studentSelected,
          this.utilsService.currentSchool.id, this.groupSelected, 1).subscribe(
            ((responseBadgeRelation: BadgeRelation) => {
              this.responseBadgeRelation = responseBadgeRelation;
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('BADGES.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      } else if (this.modeIndividual === false && this.teamSelected) {
        this.teamService.getStudentsTeam(this.teamSelected.id).subscribe(
          ((students: Array<Student>) => {
            this.Team = students;
            for (let _n = 0; _n < this.Team.length; _n++) {
              this.badgeRelationService.postBadgeRelation(this.badgeSelected, this.Team[_n].id,
                this.utilsService.currentSchool.id, this.groupSelected, 1).subscribe(
                  ((responseBadgeRelation: BadgeRelation) => {
                    this.responseBadgeRelation = responseBadgeRelation;
                    this.loadingService.hide();
                    this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
                  }),
                  ((error: Response) => {
                    this.loadingService.hide();
                    this.alertService.show(error.toString());
                  }));
            }
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      } else { this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS')); }
    }
  }

  public sendPointRelation() {
    if (!this.groupSelected || !this.pointSelected || !this.valueSelected) {
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
    } else {
      if (this.modeIndividual === true && this.studentSelected) {
        this.pointRelationService.postPointRelation(this.pointSelected, this.studentSelected,
          this.utilsService.currentSchool.id, this.groupSelected, this.valueSelected).subscribe(
            ((responsePointRelation: PointRelation) => {
              this.responsePointRelation = responsePointRelation;
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      } else if (this.modeIndividual === false && this.teamSelected) {
        this.teamService.getStudentsTeam(this.teamSelected.id).subscribe(
          ((students: Array<Student>) => {
            this.Team = students;
            for (let _n = 0; _n < this.Team.length; _n++) {
              this.pointRelationService.postPointRelation(this.pointSelected, this.Team[_n].id,
                this.utilsService.currentSchool.id, this.groupSelected, this.valueSelected).subscribe(
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
            this.loadingService.hide();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      } else {
        this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
      }
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
    } else if (this.pointId === this.questionnairePoint) {
      this.alertService.show(this.translateService.instant('POINTS.QUESTIONNAIRE'));
    } else {
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
    } else {
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

export interface Score {
  nameees: string;
  position: number;
  points: number;
  currentuser: Boolean;
  studentId: string;
}
export interface ScoreTeam {
  name: string;
  position: number;
  points: number;
}
