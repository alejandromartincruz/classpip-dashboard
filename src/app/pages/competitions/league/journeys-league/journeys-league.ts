import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../../../app.config';
import { Login, Role, Team, Student, Competition, Journey, Match } from '../../../../shared/models/index';
import { LoadingService, UtilsService, AlertService, JourneyService,
         CompetitionService, TeamService} from '../../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'app-journeys-league',
  templateUrl: './journeys-league.html',
  styleUrls: ['./journeys-league.scss']
})
export class JourneysLeagueComponent implements OnInit {

  public competitionId: string;
  public competition: Competition;
  public journeys = new Array<Journey>();
  public dates: String[];
  public matchesJourneys: Match[][];
  public matches: Match[];
  public descanso: number;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public translateService: TranslateService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public teamService: TeamService,
    public datePipe: DatePipe,
    private route: ActivatedRoute) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
    this.loadingService.show();
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getSelectedCompetition();
    }
  }

  getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
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
        this.journeys.sort(function (a, b) {
          return (a.number - b.number);
        });
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
        this.matches = matches;
        for (let _m = 0; _m < this.matches.length; _m++) {
          if (this.matches[_m].namePlayerOne === 'Ghost' || this.matches[_m].namePlayerTwo === 'Ghost') {
            this.descanso = _m;
          }
        }
        if (this.descanso !== undefined) {
          this.matches.splice(this.descanso, 1);
          }
        this.matchesJourneys[_j] = this.matches;
         if ( countJourneys === this.journeys.length ) {
           this.getDatesAndResults();
          }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
    }
  }

  getDatesAndResults(): void {
    this.dates = [];
    for (let _j = 0; _j < this.journeys.length; _j++) {
      if (this.journeys[_j].date === null) {
        this.dates[_j] = this.translateService.instant('COMPETITIONS.NOT_ESTABLISHED');
      } else {
        this.dates[_j] = this.datePipe.transform(this.journeys[_j].date, 'dd-MM-yyyy');
      }
      for (let _m = 0; _m < this.matchesJourneys[_j].length; _m++) {
        if (this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerOne ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerOne;
        } else if ( this.matchesJourneys[_j][_m].winner === this.matchesJourneys[_j][_m].playerTwo ) {
          this.matchesJourneys[_j][_m].result = this.matchesJourneys[_j][_m].namePlayerTwo;
        } else if ( this.matchesJourneys[_j][_m].winner === 1 ) {
          this.matchesJourneys[_j][_m].result = this.translateService.instant('CLASSIFICATION.DRAW2');
        } else if ( this.matchesJourneys[_j][_m].winner === 0 ) {
          this.matchesJourneys[_j][_m].result = '-';
        }
      }
    }
    this.loadingService.hide();
  }
}
