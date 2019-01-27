import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { AppConfig } from '../../../../app.config';
import {
  Login, Role, Team, Student, Competition, Journey, Match, Point, PointRelation,
  School, Badge, BadgeRelation, CollectionCard, Card
} from '../../../../shared/models/index';
import { TranslateService } from 'ng2-translate/ng2-translate';
import {
  LoadingService, UtilsService, AlertService, JourneyService, MatchesService,
  CompetitionService, TeamService, PointRelationService, PointService, SchoolService, GroupService,
  BadgeService, BadgeRelationService, CollectionService
} from '../../../../shared/services/index';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-automation2',
  templateUrl: './automation2.html',
  styleUrls: ['./automation2.scss']
})
export class Automation2Component implements OnInit {

  public final = false;
  public finished = false;
  public tournamentCompleted = false;
  public winner: string;
  public modeIndividual: boolean;

  public competitionId: number;
  public competition: Competition;

  public journeys: Journey[];
  public matchesJourneys: Match[][];
  public participants: any[];

  public lastJourney: number;
  public participantsPrimary: String[];
  public participantsSecondary: String[];
  public participantsEliminated: String[];
  public ghostIndex: number;

  // PREMIOS
  myControl = new FormControl();
  public collectionTeams: Array<Team>;
  public collectionStudents: Array<Student>;
  public GroupIdAwards: string;
  public SchoolIdAwards: string;
  public Automation_Team: Array<any>;
  public Team1: Array<Student>;
  public Team2: Array<Student>;

  // Collections
  // Get Collection (and Card if options[0])
  public collections: Array<CollectionCard>; // collections of the group
  public CollectionSelectedId: string; // selected collection in the mat-select
  public collectionCards: Array<Card>; // cards of the CollectionSelected, options[0]
  // Set option
  public options = [];
  public optionType: string; // selected option
  public cardSelected: string; // options[0]
  public nocol = false;
  //
  public count: number;
  //
  public finalistas: Array<string>;
  public ganador: string;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public matchesService: MatchesService,
    public teamService: TeamService,
    public schoolService: SchoolService,
    public pointService: PointService,
    public pointRelationService: PointRelationService,
    public groupService: GroupService,
    public translateService: TranslateService,
    public badgeService: BadgeService,
    public badgeRelationService: BadgeRelationService,
    public collectionService: CollectionService,
    public snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute) {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
      this.loadingService.show();
      this.competitionId = +this.route.snapshot.paramMap.get('id');
      this.nocol = false;
      this.getSelectedCompetition();
    }
  }
  /** This method returnsthe current competition and calls the getMatches method */
  private getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.GroupIdAwards = this.competition.groupId.toString();
        this.getJourneys();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  /**
   * This method returns the journeys of the current competition
   * and calls the getMatches method
   */
  private getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) { return (a.number - b.number); });
        // tslint:disable-next-line:no-console
        console.log(this.journeys);
        this.getMatches();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  /**
   * This method returns the matches of each journey
   * and calls the getParticipants method
   */
  private getMatches(): void {
    this.matchesJourneys = [];
    let journeysCompleted = 0;
    for (let _n = 0; _n < this.journeys.length; _n++) {
      this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
        ((matches: Array<Match>) => {
          this.matchesJourneys[_n] = [];
          for (let _m = 0; _m < matches.length; _m++) {
            this.matchesJourneys[_n][_m] = new Match();
            this.matchesJourneys[_n][_m] = matches[_m];
          }
          journeysCompleted++;
          if (this.matchesJourneys[_n][0].winner === 0) { this.lastJourney = _n; }
          if (journeysCompleted === this.lastJourney + 1 || this.matchesJourneys.length === this.journeys.length) {
            if (this.lastJourney === undefined) { this.lastJourney = this.journeys.length - 1; }
            // tslint:disable-next-line:no-console
            console.log(this.matchesJourneys);
            this.getParticipants();
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  /**
   * This method returns the participants of the current competition
   * and calls the getTournamentStatus method
   */
  private getParticipants(): void {
    this.participants = [];
    if (this.competition.mode === 'Individual') {
      this.modeIndividual = true;
      this.competitionService.getStudentsCompetition(this.competition.id).subscribe(
        ((students: Array<Student>) => {
          this.collectionStudents = students;
          this.SchoolIdAwards = students[0].schoolId.toString();
          for (let _s = 0; _s < students.length; _s++) {
            this.participants[_s] = {
              id: +students[_s].id,
              name: students[_s].name.concat(' ', students[_s].surname)
            };
          }
          this.getTournamentStatus();
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
          for (let _t = 0; _t < teams.length; _t++) {
            this.participants[_t] = {
              id: +teams[_t].id,
              name: teams[_t].name
            };
          }
          this.getTournamentStatus();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  /**
   * This method divides the participants between the main tournament,
   *  the secondary tournament and the eliminated ones
   */
  private getTournamentStatus(): void {

    this.participantsPrimary = [];
    this.participantsSecondary = [];
    this.finalistas = [];

    for (let _m = 0; _m < this.matchesJourneys[this.lastJourney].length; _m++) {
      if (this.lastJourney === 0) {
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
      } else if ((this.lastJourney + 1) % 2 === 0 && this.lastJourney + 1 !== this.journeys.length) {
        if (_m < this.matchesJourneys[this.lastJourney].length / 2) {
          this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
          this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
        } else {
          this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
          this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
        }
      } else if ((this.lastJourney + 1) % 2 !== 0) {
        this.matchesJourneys[this.lastJourney - 1][_m].winner === this.matchesJourneys[this.lastJourney - 1][_m].playerOne ?
          this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerOne) :
          this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerTwo);
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
      } else if (this.lastJourney + 1 === this.journeys.length) {
        this.final = true;
        if (this.matchesJourneys[this.lastJourney][0].winner !== 0) {
          this.tournamentCompleted = true;
          this.matchesJourneys[this.lastJourney][0].winner === this.matchesJourneys[this.lastJourney][0].playerOne ?
            this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerOne :
            this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerTwo;
          if (this.winner === this.matchesJourneys[this.lastJourney][0].namePlayerOne) {
            this.ganador = this.matchesJourneys[this.lastJourney][0].playerOne.toString();
          } else if (this.winner === this.matchesJourneys[this.lastJourney][0].namePlayerTwo) {
            this.ganador = this.matchesJourneys[this.lastJourney][0].playerTwo.toString();
          }
        }
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
        this.finalistas.push(this.matchesJourneys[this.lastJourney][_m].playerOne.toString());
        this.finalistas.push(this.matchesJourneys[this.lastJourney][_m].playerTwo.toString());
      }
    }

    // Deleting ghosts to show
    this.ghostIndex = 0;
    while (this.ghostIndex < this.participantsPrimary.length) {
      if (this.participantsPrimary[this.ghostIndex] === 'Ghost') {
        this.participantsPrimary.splice(this.ghostIndex, 1);
        this.ghostIndex = 0;
      } else { this.ghostIndex++; }
    }
    this.ghostIndex = 0;
    while (this.ghostIndex < this.participantsSecondary.length) {
      if (this.participantsSecondary[this.ghostIndex] === 'Ghost') {
        this.participantsSecondary.splice(this.ghostIndex, 1);
        this.ghostIndex = 0;
      } else { this.ghostIndex++; }
    }

    // Adding eliminated participants
    this.participantsEliminated = [];
    for (let _d = 0; _d < this.participants.length; _d++) {
      let count = 0;
      for (let _p = 0; _p < this.participantsPrimary.length; _p++) {
        if (this.participants[_d].name === this.participantsPrimary[_p]) {
          count = 1;
        }
      }
      if (count === 0) { this.participantsEliminated.push(this.participants[_d].name); }
    }

    let _q = 0;
    while (_q < this.participantsEliminated.length) {
      let count = 0;
      for (let _p = 0; _p < this.participantsSecondary.length; _p++) {
        if (this.participantsEliminated[_q] === this.participantsSecondary[_p]) {
          count = 1;
        }
      }
      if (count === 1) {
        this.participantsEliminated.splice(_q, 1);
        _q = 0;
      } else { _q++; }
    }
    if (this.final === true) {
      this.getCollections();
    } else {
      const url = '/competition/tennis/' + this.competitionId.toString();
      this.router.navigate([url]);
    }
  }

  getCollections(): void {
    this.groupService.getGroupCollectionCards(this.GroupIdAwards).subscribe(
      ((coleccion: Array<CollectionCard>) => {
        this.collections = coleccion;
        if (this.collections.length === 0) {
          this.NoCollection();
        } else {
          this.finished = true;
          // coleccion aleatoria
          var numcollection = this.randomNumber(1, this.collections.length);
          this.snackbar.open(String(numcollection) + '/' + String(this.count));
          this.CollectionSelectedId = numcollection.toString();
          this.showCards();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
      }));
  }

  NoCollection(): void {
    if (this.competition.automation === '11' || this.competition.automation === '01') {
      this.nocol = true;
      this.finished = true;
      this.loadingService.hide();
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

  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  Participants(): void {
    if (this.modeIndividual === true) {
      if (this.tournamentCompleted === true) {
        this.AutomationsWinnerInd();
      } else { this.assignAutomationsInd(); }
    } else {
      if (this.tournamentCompleted === false) {
        this.Automation_Team = [];
        this.teamService.getStudentsTeam(this.finalistas[0]).subscribe(
          ((students: Array<Student>) => {
            this.Team1 = students;
            this.Automation_Team[0] = this.Team1;
            this.SchoolIdAwards = students[0].schoolId.toString();
            this.teamService.getStudentsTeam(this.finalistas[1]).subscribe(
              ((students2: Array<Student>) => {
                this.Team2 = students2;
                this.Automation_Team[1] = this.Team2;
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
      } else {
        this.teamService.getStudentsTeam(this.ganador).subscribe(
          ((students: Array<Student>) => {
            this.Team1 = students;
            this.SchoolIdAwards = students[0].schoolId.toString();
            this.AutomationsWinnerTeam();
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));

      }
    }
  }

  AutomationsWinnerInd(): void {
    if (this.competition.automation === '11') {
      this.pointRelationService.postPointRelation(this.competition.pointId, this.ganador, this.SchoolIdAwards,
        this.GroupIdAwards, 1).subscribe(
          ((responsePointRelation: PointRelation) => {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));

      var numcard = this.randomNumber(1, this.collectionCards.length - 1);
      this.snackbar.open(String(numcard) + '/' + String(this.count));
      this.collectionService.assignCardToStudent(this.ganador, numcard).subscribe(
        ((collectionCards: Array<Card>) => {
          this.loadingService.hide();
          this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

    } else if (this.competition.automation === '10') {
      this.pointRelationService.postPointRelation(this.competition.pointId, this.ganador, this.SchoolIdAwards,
        this.GroupIdAwards, 1).subscribe(
          ((responsePointRelation: PointRelation) => {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
    } else if (this.competition.automation === '01') {
      var numcard = this.randomNumber(1, this.collectionCards.length - 1);
      this.snackbar.open(String(numcard) + '/' + String(this.count));
      this.collectionService.assignCardToStudent(this.ganador, numcard).subscribe(
        ((collectionCards: Array<Card>) => {
          this.loadingService.hide();
          this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    } else if (this.competition.automation === '00') {

    }
  }

  assignAutomationsInd(): void {
    if (this.competition.automation === '11') {
      // Assignar 1 punt de competició al primer i segon
      this.pointRelationService.postPointRelation(this.competition.pointId, this.finalistas[0], this.SchoolIdAwards,
        this.GroupIdAwards, 1).subscribe(
          ((responsePointRelation: PointRelation) => {
            this.pointRelationService.postPointRelation(this.competition.pointId, this.finalistas[1], this.SchoolIdAwards,
              this.GroupIdAwards, 1).subscribe(
                ((responsePointRelation2: PointRelation) => {
                  var numcard = this.randomNumber(1, this.collectionCards.length - 1);
                  this.snackbar.open(String(numcard) + '/' + String(this.count));
                  this.collectionService.assignCardToStudent(this.finalistas[0], numcard).subscribe(
                    ((collectionCards: Array<Card>) => {
                      var numcard = this.randomNumber(1, this.collectionCards.length - 1);
                      this.snackbar.open(String(numcard) + '/' + String(this.count));
                      this.collectionService.assignCardToStudent(this.finalistas[1], numcard).subscribe(
                        ((collectionCards2: Array<Card>) => {
                          this.loadingService.hide();
                          this.alertService.show(this.translateService.instant('CARDS.CORASSIGN2'));
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


    } else if (this.competition.automation === '10') {
      // Assignar 1 punt de competició al primer i segon
      for (let _j = 0; _j < this.finalistas.length; _j++) {
        this.pointRelationService.postPointRelation(this.competition.pointId, this.finalistas[_j], this.SchoolIdAwards,
          this.GroupIdAwards, 1).subscribe(
            ((responsePointRelation: PointRelation) => {
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
      for (let _j = 0; _j < this.finalistas.length; _j++) {
        var numcard = this.randomNumber(1, this.collectionCards.length - 1);
        this.snackbar.open(String(numcard) + '/' + String(this.count));
        this.collectionService.assignCardToStudent(this.finalistas[_j], numcard).subscribe(
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

  AutomationsWinnerTeam(): void {
    if (this.competition.automation === '11') {
      for (let _n = 0; _n < this.Team1.length; _n++) {
        this.pointRelationService.postPointRelation(this.competition.pointId, this.Team1[_n].id, this.SchoolIdAwards,
          this.GroupIdAwards, 1).subscribe(
            ((responsePointRelation: PointRelation) => {
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      }
      var numcard = this.randomNumber(1, this.collectionCards.length - 1);
      this.snackbar.open(String(numcard) + '/' + String(this.count));
      for (let _n = 0; _n < this.Team1.length; _n++) {
        this.collectionService.assignCardToStudent(this.Team1[_n].id, numcard).subscribe(
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
      for (let _n = 0; _n < this.Team1.length; _n++) {
        this.pointRelationService.postPointRelation(this.competition.pointId, this.Team1[_n].id, this.SchoolIdAwards,
          this.GroupIdAwards, 1).subscribe(
            ((responsePointRelation: PointRelation) => {
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
            }),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
      }
    } else if (this.competition.automation === '01') {
      var numcard = this.randomNumber(1, this.collectionCards.length - 1);
      this.snackbar.open(String(numcard) + '/' + String(this.count));
      for (let _n = 0; _n < this.Team1.length; _n++) {
        this.collectionService.assignCardToStudent(this.Team1[_n].id, numcard).subscribe(
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
}
