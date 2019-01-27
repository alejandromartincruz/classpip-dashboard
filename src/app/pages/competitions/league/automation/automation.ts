import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppConfig } from '../../../../app.config';
import {
  Login, Student, Role, Competition, Journey, Match, Team, Point, PointRelation,
  School, Badge, BadgeRelation, CollectionCard, Card
} from '../../../../shared/models/index';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {
  LoadingService, UtilsService, AlertService, TeamService, CompetitionService,
  JourneyService, PointRelationService, PointService, SchoolService, GroupService,
  BadgeService, BadgeRelationService, CollectionService
} from '../../../../shared/services/index';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-automation',
  templateUrl: './automation.html',
  styleUrls: ['./automation.scss']
})
export class AutomationComponent implements OnInit {

  public competition: Competition;
  public competitionId: string;
  public modeIndividual: boolean;

  public journeys: Journey[];
  public participants: Participant[];
  public odd: boolean;
  public matchesJourneys: Array<Array<Match>>;

  public Information: string;

  // PREMIOS
  // BestParticipants
  public GroupIdAwards: string;
  public SchoolIdAwards: string;
  public Primer_Id: string;
  public Automation_PartId: Array<string>;
  public Segon_Id: string;
  public Automation_Team: Array<any>;
  public Team1: Array<Student>;
  public Team2: Array<Student>;

  // Point
  public Primer_PointRelation: PointRelation;
  public Segon_PointRelation: PointRelation;

  // Collections
  myControl = new FormControl();
  public count: number;
  // Sacar collections del grupo
  public existCollection: boolean;
  public collections: Array<CollectionCard>; // collections of the group
  public CollectionSelectedId: string; // selected collection in the mat-select
  public collectionCards: Array<Card>; // cards of the CollectionSelected, options[0]
  // Students
  public collectionStudents: Array<Student>;
  public collectionTeams: Array<Team>;


  public scores = new Array<Score>();
  public score: Score;

  constructor(public utilsService: UtilsService,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public journeyService: JourneyService,
    public schoolService: SchoolService,
    public pointService: PointService,
    public pointRelationService: PointRelationService,
    public groupService: GroupService,
    public translateService: TranslateService,
    public badgeService: BadgeService,
    public badgeRelationService: BadgeRelationService,
    public collectionService: CollectionService,
    public snackbar: MatSnackBar,
    private route: ActivatedRoute,
    private teamService: TeamService,
    private competitionService: CompetitionService) {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
      this.loadingService.show();
      this.competitionId = this.route.snapshot.paramMap.get('id');
      this.getClassificationOfCompetition();
    }
  }

  getClassificationOfCompetition(): void {
    this.competitionService.getCompetition(this.competitionId)
      .subscribe(((competition: Competition) => {
        this.competition = competition;
        this.getJourneys();
      }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
  }

  getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.getMatches();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getMatches(): void {
    let countJourneys = 0;
    this.matchesJourneys = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      this.matchesJourneys[_j] = [];
      this.journeyService.getMatchesJourneyDetails(this.journeys[_j].id, this.competition).subscribe(
        ((matches: Array<Match>) => {
          countJourneys = countJourneys + 1;
          for (let _m = 0; _m < matches.length; _m++) {
            this.matchesJourneys[_j][_m] = new Match();
            this.matchesJourneys[_j][_m] = matches[_m];
          }
          if (countJourneys === this.journeys.length) {
            this.getParticipants();
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  getParticipants(): void {
    this.participants = [];
    if (this.competition.mode === 'Individual') {
      this.modeIndividual = true;
      this.competitionService.getStudentsCompetition(this.competitionId).subscribe(
        ((students: Array<Student>) => {
          this.collectionStudents = students;
          if (students.length % 2 === 0) { this.odd = false; } else { this.odd = true; }
          for (let _s = 0; _s < students.length; _s++) {
            this.participants[_s] = {
              id: +students[_s].id,
              name: students[_s].name.concat(' ', students[_s].surname)
            };
          }
          this.getScores();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    } else {
      this.modeIndividual = false;
      this.teamService.getTeamsCompetition(this.competitionId).subscribe(
        ((teams: Array<Team>) => {
          this.collectionTeams = teams;
          if (teams.length % 2 === 0) { this.odd = false; } else { this.odd = true; }
          for (let _t = 0; _t < teams.length; _t++) {
            this.participants[_t] = {
              id: +teams[_t].id,
              name: teams[_t].name
            };
          }
          this.getScores();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  getScores(): void {
    this.scores = [];
    for (let _p = 0; _p < this.participants.length; _p++) {
      this.score = {
        position: 0, name: this.participants[_p].name,
        played: 0, won: 0, draw: 0, lost: 0, points: 0
      };
      for (let _j = 0; _j < this.journeys.length; _j++) {
        let found = false;
        for (let _m = 0; _m < this.matchesJourneys[_j].length && !found; _m++) {
          if (+this.participants[_p].id === this.matchesJourneys[_j][_m].playerOne ||
            +this.participants[_p].id === this.matchesJourneys[_j][_m].playerTwo) {
            if (this.matchesJourneys[_j][_m].winner === +this.participants[_p].id) {
              this.score.points = this.score.points + 3;
              this.score.won = this.score.won + 1;
              this.score.played = this.score.played + 1;
            } else if (this.matchesJourneys[_j][_m].winner === 1) {
              this.score.points = this.score.points + 1;
              this.score.draw = this.score.draw + 1;
              this.score.played = this.score.played + 1;
            } else if (this.matchesJourneys[_j][_m].winner === 2
              || this.matchesJourneys[_j][_m].winner === 0) {
            } else {
              this.score.lost = this.score.lost + 1;
              this.score.played = this.score.played + 1;
            }
            found = true;
          }
        }
      }
      this.scores.push(this.score);
    }
    this.scores.sort(function (a, b) {
      return (b.points - a.points);
    });
    for (let _s = 0; _s < this.scores.length; _s++) {
      this.scores[_s].position = _s + 1;
    }
    this.SetBestParticipants();
  }

  SetBestParticipants(): void {
    for (let _m = 0; _m < this.participants.length; _m++) {
      if (this.scores[0].name === this.participants[_m].name) {
        this.Primer_Id = this.participants[_m].id.toString();
      }
      if (this.scores[1].name === this.participants[_m].name) {
        this.Segon_Id = this.participants[_m].id.toString();
      }
    }
    this.GroupIdAwards = this.competition.groupId.toString();
    this.getCollections();
  }

  getCollections(): void {
    this.groupService.getGroupCollectionCards(this.GroupIdAwards).subscribe(
      ((coleccion: Array<CollectionCard>) => {
        this.collections = coleccion;
        if (this.collections.length === 0) {
          this.existCollection = false;
          this.NoCollection();
        } else {
          this.existCollection = true;
          // coleccion aleatoria
          var numcollection = this.randomNumber(1, this.collections.length);
          this.snackbar.open(String(numcollection) + '/' + String(this.count));
          this.CollectionSelectedId = numcollection.toString();
          this.showCards();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    this.loadingService.hide();
  }

  NoCollection(): void {
    if (this.competition.automation === '11' || this.competition.automation === '01') {
    } else { this.Participants(); }
  }

  showCards(): void {
    this.collectionService.getCollectionDetails(this.CollectionSelectedId).subscribe(
      ((collectionCards: Array<Card>) => {
        this.collectionCards = collectionCards;
        this.loadingService.hide();
        this.Participants();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  Participants(): void {
    this.Automation_PartId = [];
    if (this.modeIndividual === true) {
      this.Automation_PartId[0] = this.Primer_Id;
      this.Automation_PartId[1] = this.Segon_Id;
      this.groupService.getMyGroupStudents(this.GroupIdAwards).subscribe(
        ((students: Array<Student>) => {
          for (let _n = 0; _n < students.length; _n++) {
            if (this.Primer_Id === students[_n].id) {
              this.SchoolIdAwards = students[_n].schoolId.toString();
            }
          }
          this.assignAutomationsInd();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    } else {
      this.Automation_Team = [];
      this.teamService.getStudentsTeam(this.Primer_Id).subscribe(
        ((students: Array<Student>) => {
          this.Team1 = students;
          this.Automation_Team[0] = this.Team1;
          this.SchoolIdAwards = students[0].schoolId.toString();
          this.teamService.getStudentsTeam(this.Segon_Id).subscribe(
            ((students2: Array<Student>) => {
              this.Team2 = students2;
              this.Automation_Team[1] = this.Team2;
              this.loadingService.hide();
              this.assignAutomationsTeam();
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  assignAutomationsInd(): void {
    if (this.competition.automation === '11') {
      // Assignar 1 punt de competició al primer i segon
      for (let _j = 0; _j < this.Automation_PartId.length; _j++) {
        this.pointRelationService.postPointRelation(this.competition.pointId, this.Automation_PartId[_j], this.SchoolIdAwards,
          this.GroupIdAwards, 1).subscribe(
            ((responsePointRelation: PointRelation) => {
              this.Primer_PointRelation = responsePointRelation;
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      }
      // Assignar 1 cromo aleatori al primer i segon
      for (let _j = 0; _j < this.Automation_PartId.length; _j++) {
        var numcard = this.randomNumber(1, this.collectionCards.length - 1);
        this.snackbar.open(String(numcard) + '/' + String(this.count));
        this.collectionService.assignCardToStudent(this.Automation_PartId[_j], numcard).subscribe(
          ((collectionCards: Array<Card>) => {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }
    } else if (this.competition.automation === '10') {
      // Assignar 1 punt de competició al primer i segon
      for (let _j = 0; _j < this.Automation_PartId.length; _j++) {
        this.pointRelationService.postPointRelation(this.competition.pointId, this.Automation_PartId[_j], this.SchoolIdAwards,
          this.GroupIdAwards, 1).subscribe(
            ((responsePointRelation: PointRelation) => {
              this.Primer_PointRelation = responsePointRelation;
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      }
    } else if (this.competition.automation === '01') {
      // Assignar 1 cromo aleatori al primer i segon
      for (let _j = 0; _j < this.Automation_PartId.length; _j++) {
        var numcard = this.randomNumber(1, this.collectionCards.length - 1);
        this.snackbar.open(String(numcard) + '/' + String(this.count));
        this.collectionService.assignCardToStudent(this.Automation_PartId[_j], numcard).subscribe(
          ((collectionCards: Array<Card>) => {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }
    } else if (this.competition.automation === '00') {

    }
  }

  assignAutomationsTeam(): void {
    if (this.competition.automation === '11') {
      // Assignar 1 punt de competició al primer i segon
      for (let _j = 0; _j < this.Automation_Team.length; _j++) {
        let Tm = this.Automation_Team[_j];
        for (let _n = 0; _n < Tm.length; _n++) {
          this.pointRelationService.postPointRelation(this.competition.pointId, Tm[_n].id, this.SchoolIdAwards,
            this.GroupIdAwards, 1).subscribe(
              ((responsePointRelation: PointRelation) => {
                this.Primer_PointRelation = responsePointRelation;
                this.loadingService.hide();
                this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));
        }
      }
      // Assignar 1 cromo aleatori al primer i segon
      for (let _j = 0; _j < this.Automation_Team.length; _j++) {
        var numcard = this.randomNumber(1, this.collectionCards.length - 1);
        this.snackbar.open(String(numcard) + '/' + String(this.count));
        let Tm = this.Automation_Team[_j];
        for (let _n = 0; _n < Tm.length; _n++) {
          this.collectionService.assignCardToStudent(Tm[_n].id, numcard).subscribe(
            ((collectionCards: Array<Card>) => {
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }
      }
    } else if (this.competition.automation === '10') {
      // Assignar 1 punt de competició al primer i segon
      for (let _j = 0; _j < this.Automation_Team.length; _j++) {
        let Tm = this.Automation_Team[_j];
        for (let _n = 0; _n < Tm.length; _n++) {
          this.pointRelationService.postPointRelation(this.competition.pointId, Tm[_n].id, this.SchoolIdAwards,
            this.GroupIdAwards, 1).subscribe(
              ((responsePointRelation: PointRelation) => {
                this.Primer_PointRelation = responsePointRelation;
                this.loadingService.hide();
                this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
              }),
              ((error: Response) => {
                this.loadingService.hide();
                this.alertService.show(error.toString());
              }));
        }
      }
    } else if (this.competition.automation === '01') {
      // Assignar 1 cromo aleatori al primer i segon
      for (let _j = 0; _j < this.Automation_Team.length; _j++) {
        var numcard = this.randomNumber(1, this.collectionCards.length - 1);
        this.snackbar.open(String(numcard) + '/' + String(this.count));
        let Tm = this.Automation_Team[_j];
        for (let _n = 0; _n < Tm.length; _n++) {
          this.collectionService.assignCardToStudent(Tm[_n].id, numcard).subscribe(
            ((collectionCards: Array<Card>) => {
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        }
      }
    } else if (this.competition.automation === '00') {

    }
  }

  // Creación de un numero random para  asignar cromos aletorios
  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
}

export interface Score {
  position: number;
  name: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
}

export interface Participant {
  id: number;
  name: string;
}
