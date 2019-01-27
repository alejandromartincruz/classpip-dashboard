import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA , MatSnackBar} from '@angular/material';
import { FormControl } from '@angular/forms';
import { AppConfig } from '../../../../app.config';
import { Login, Role, Team, Student, Competition, Journey, Match, Point, PointRelation,
  School, Badge, BadgeRelation, CollectionCard, Card } from '../../../../shared/models/index';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { LoadingService, UtilsService, AlertService, JourneyService, MatchesService,
        CompetitionService, TeamService, PointRelationService, PointService, SchoolService, GroupService,
        BadgeService, BadgeRelationService, CollectionService} from '../../../../shared/services/index';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.html',
  styleUrls: ['./tournaments.scss']
})
export class TournamentsComponent implements OnInit {

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
  public studentSelected: Student;
  public teamSelected: string;
  // Points

  // Badges

  // Collections


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
    private route: ActivatedRoute) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
     }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
      this.loadingService.show();
      this.competitionId = +this.route.snapshot.paramMap.get('id');
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
        if ( journeysCompleted === this.lastJourney + 1 || this.matchesJourneys.length === this.journeys.length) {
          if ( this.lastJourney === undefined ) { this.lastJourney = this.journeys.length - 1; }
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

    for (let _m = 0; _m < this.matchesJourneys[this.lastJourney].length; _m++) {
     if ( this.lastJourney === 0 ) {
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     } else if ( (this.lastJourney + 1) % 2 === 0 && this.lastJourney + 1 !== this.journeys.length ) {
       if ( _m < this.matchesJourneys[this.lastJourney].length / 2 ) {
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
       } else {
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
        this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
       }
     } else if ( (this.lastJourney + 1) % 2 !== 0 ) {
      this.matchesJourneys[this.lastJourney - 1][_m].winner === this.matchesJourneys[this.lastJourney - 1][_m].playerOne ?
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerOne) :
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney - 1][_m].namePlayerTwo);
      this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsSecondary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     } else if ( this.lastJourney + 1 === this.journeys.length ) {
      this.final = true;
      if ( this.matchesJourneys[this.lastJourney][0].winner !== 0) {
        this.tournamentCompleted = true;
        this.matchesJourneys[this.lastJourney][0].winner === this.matchesJourneys[this.lastJourney][0].playerOne ?
        this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerOne :
        this.winner = this.matchesJourneys[this.lastJourney][0].namePlayerTwo;
      }
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerOne);
      this.participantsPrimary.push(this.matchesJourneys[this.lastJourney][_m].namePlayerTwo);
     }
    }

    // Deleting ghosts to show
    this.ghostIndex = 0;
    while ( this.ghostIndex < this.participantsPrimary.length) {
      if (this.participantsPrimary[this.ghostIndex] === 'Ghost') {
        this.participantsPrimary.splice(this.ghostIndex, 1);
        this.ghostIndex = 0;
      } else { this.ghostIndex++; }
    }
    this.ghostIndex = 0;
    while ( this.ghostIndex < this.participantsSecondary.length) {
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
        if ( this.participants[_d].name === this.participantsPrimary[_p] ) {
          count = 1;
        }
      }
      if (count === 0) { this.participantsEliminated.push(this.participants[_d].name); }
    }

    let _q = 0;
    while (_q < this.participantsEliminated.length) {
      let count = 0;
      for (let _p = 0; _p < this.participantsSecondary.length; _p++) {
        if ( this.participantsEliminated[_q] === this.participantsSecondary[_p] ) {
          count = 1;
        }
      }
      if (count === 1) {
       this.participantsEliminated.splice(_q, 1);
       _q = 0;
      } else { _q++; }
    }
    this.loadingService.hide();
    this.finished = true;
  }
}
