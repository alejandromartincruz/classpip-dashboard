import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { AppConfig } from '../../../app.config';
import { Point, Student, ResultPoints, PointRelation, Login, Group, Role, Competition, Journey, Match } from '../../../shared/models/index';
import {
  LoadingService, UtilsService, GroupService, AlertService, CompetitionService,
  JourneyService, MatchesService, PointRelationService, PointService
} from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { DeleteCompetitionComponent } from '../delete-competition/delete-competition';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'app-tennis',
  templateUrl: './tennis.html',
  styleUrls: ['./tennis.scss']
})
export class TennisComponent implements OnInit {

  // Html
  public show: boolean; // information
  public option: string; // random or manually
  public matchesUploaded: boolean;
  public finished: boolean;
  // Forms
  public journeysFormGroup: FormGroup;
  public informationFormGroup: FormGroup;
  public resultsFormGroup: FormGroup;
  // Get methods
  public competitionId: number;
  public competition: Competition;
  public information: string;
  public journeys = new Array<Journey>();
  public matchesJourneys: Match[][];
  public lastJourney: number;
  // Expansion panels
  public notCompletedJourneys = new Array<Journey>();
  public newInformation: any;
  public clicked: boolean;
  public matches = new Array<Match>();
  public showMatchesPrimary: String[][];
  public showMatchesIdPrimary: Number[][];
  public ghostsPrimary: Array<Array<number>>;
  public showMatchesSecondary: String[][];
  public showMatchesIdSecondary: Number[][];
  public ghostsSecondary: Array<Array<number>>;
  // Submit results
  public results: any[];
  public results2: any[];
  public matchesIdPrimary: Array<number>;
  public matchesIdSecondary: Array<number>;
  // Next journey
  public postMatches: Array<Match>;
  public principalMatches: Array<number>;
  public secondaryMatches: Array<number>;
  public submitMatches: Array<number>;
  public match1: any;

  public points: Array<Point>; // School Points list ready to Send
  public studentPoints: Array<PointRelation> = new Array<PointRelation>(); // List of PointRelation of Student
  public listPoints: Array<ResultPoints>; // Student points list
  public totalPointsplayertwo: number;
  public totalPointsplayerone: number;
  public winner: any;
  public listStudentsPoints: Array<Student> = new Array<Student>();
  public scores = new Array<Score>();
  public winnermatch: string;
  public score: Score;
  public journeyIndex: number;
  public groupSelected: string; // points group select
  public listStudents: Array<Student> = new Array<Student>();
  public break: number;
  public url: string;
  public puntoss: number;
  public valuePoints: Array<PointRelation> = new Array<PointRelation>();
  public totalPointsStudent: number;

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public translateService: TranslateService,
    public pointService: PointService,
    public pointRelationService: PointRelationService,
    public groupService: GroupService,
    public journeyService: JourneyService,
    public competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private matchesService: MatchesService,
    private _formBuilder: FormBuilder,
    private dialog?: MatDialog) {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    this.show = false;
    this.option = 'Manualmente';
    this.matchesUploaded = false;
    this.finished = false;
    this.clicked = false;
  }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER || this.utilsService.role === Role.STUDENT) {
      this.loadingService.show();
      this.journeysFormGroup = this._formBuilder.group({
        id: ['', Validators.required],
        date: ['', Validators.required]
      });

      this.informationFormGroup = this._formBuilder.group({
        information: ['']
      });

      this.resultsFormGroup = this._formBuilder.group({
        results: this._formBuilder.array([
          this._formBuilder.group({
            winner: ['', Validators.required]
          })
        ]),
        results2: this._formBuilder.array([
          this._formBuilder.group({
            winner: ['', Validators.required]
          })
        ])
      });

      this.competitionId = +this.route.snapshot.paramMap.get('id');
      this.getSelectedCompetition();
    }
  }

  getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.information = competition.information;
        if (this.utilsService.role === Role.TEACHER) {
          this.getJourneys();
        } else {
          this.finished = true;
          this.loadingService.hide();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  getpoints(value): void {
    this.groupService.getMyGroupStudents(value).subscribe(
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
                if (rel.groupId === +value) {
                  this.pointService.getPoint(rel.pointId).subscribe(
                    ((valuep: Point) => {
                      this.loadingService.hide();
                      st.totalPoints += Number(valuep.value) * Number(rel.value);
                      this.puntoss += Number(valuep.value) * Number(rel.value);
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

  getJourneys(): void {
    this.journeyService.getJourneysCompetition(this.competitionId).subscribe(
      ((journeys: Array<Journey>) => {
        this.journeys = journeys;
        this.journeys.sort(function (a, b) { return (a.number - b.number); });
        this.getMatches();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  getMatches(): void {
    this.matchesJourneys = [];
    let journeysCount = 0;
    for (let _n = 0; _n < this.journeys.length; _n++) {
      this.journeys[_n].completed = false;
      this.journeyService.getMatchesJourneyDetails(this.journeys[_n].id, this.competition).subscribe(
        ((matches: Array<Match>) => {
          this.matchesJourneys[_n] = [];
          let incompletedJourney = 0;
          for (let _m = 0; _m < matches.length; _m++) {
            this.matchesJourneys[_n][_m] = new Match();
            this.matchesJourneys[_n][_m] = matches[_m];
            if (this.matchesJourneys[_n][_m].winner === 0) {
              incompletedJourney++;
              if (incompletedJourney === matches.length) {
                this.lastJourney = _n;
                this.matches = matches;
              }
            }
          }
          journeysCount++;
          if (journeysCount === this.lastJourney + 1 || journeysCount === this.journeys.length) {
            this.loadJourneysSection();
          }
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  loadJourneysSection() {
    for (let _j = this.lastJourney; _j < this.journeys.length; _j++) { this.notCompletedJourneys.push(this.journeys[_j]); }
    this.finished = true;
    this.loadingService.hide();
  }

  loadResultSection() {
    if (!this.clicked) {
      this.clicked = true;
      this.loadingService.show();
      // Building matches to show
      this.showMatchesPrimary = [];
      this.showMatchesIdPrimary = [];
      this.ghostsPrimary = [];
      this.matchesIdPrimary = [];
      this.showMatchesSecondary = [];
      this.showMatchesIdSecondary = [];
      this.ghostsSecondary = [];
      this.matchesIdSecondary = [];
      for (let _m = 0; _m < this.matches.length; _m++) {
        if ((this.lastJourney + 1) % 2 !== 0) { // jornada impar
          if (this.lastJourney === 0) {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
              this.showMatchesIdPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
              this.showMatchesPrimary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
              this.matchesIdPrimary.push(+this.matches[_m].id);
            } else {
              this.ghostsPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          } else {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
              this.showMatchesIdSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
              this.showMatchesSecondary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
              this.matchesIdSecondary.push(+this.matches[_m].id);
            } else {
              this.ghostsSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          }
        } else {   // journeys with principal and secondary matches
          if (_m < this.matches.length / 2) {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
              this.showMatchesIdPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
              this.showMatchesPrimary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
              this.matchesIdPrimary.push(+this.matches[_m].id);
            } else {
              this.ghostsPrimary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          } else {
            if (this.matches[_m].namePlayerOne !== 'Ghost' && this.matches[_m].namePlayerTwo !== 'Ghost') {
              this.showMatchesIdSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo]);
              this.showMatchesSecondary.push([this.matches[_m].namePlayerOne, this.matches[_m].namePlayerTwo]);
              this.matchesIdSecondary.push(+this.matches[_m].id);
            } else {
              this.ghostsSecondary.push([this.matches[_m].playerOne, this.matches[_m].playerTwo, +this.matches[_m].id]);
            }
          }
        }
      }
      for (let _a = 0; _a < this.showMatchesPrimary.length - 1; _a++) {
        let results = <FormArray>this.resultsFormGroup.get('results');
        results.push(this._formBuilder.group({
          winner: ['', Validators.required]
        }));
      }
      for (let _a = 0; _a < this.showMatchesSecondary.length - 1; _a++) {
        let results2 = <FormArray>this.resultsFormGroup.get('results2');
        results2.push(this._formBuilder.group({
          winner: ['', Validators.required]
        }));
      }
      if (this.showMatchesPrimary.length === 0) {
        let primary = <FormArray>this.resultsFormGroup.get('results');
        primary.removeAt(0);
      }
      if (this.showMatchesSecondary.length === 0) {
        let secondary = <FormArray>this.resultsFormGroup.get('results2');
        secondary.removeAt(0);
      }
    }
    this.loadingService.hide();
  }

  onSubmitJourney(value) {
    this.loadingService.show();
    this.journeyService.putJourney(value).subscribe();
    this.loadingService.hide();
    this.alertService.show(this.translateService.instant('COMPETITION_CREATION.UPDATED_JOURNEY'));
  }

  onSubmitInformation(value: string) {
    this.loadingService.show();
    this.competitionService.putInformation(value, this.competitionId).subscribe();
    this.newInformation = value;
    this.competition.information = this.newInformation.information;
    this.loadingService.hide();
    this.alertService.show(this.translateService.instant('COMPETITION_CREATION.UPDATED_INFORMATION'));
  }

  onSubmitResults(value) {
    this.loadingService.show();
    this.results = [];
    this.results2 = [];
    this.postMatches = [];

    if (value === undefined) {
      if (this.option === 'Aleatoriamente') {
        this.alertService.show(this.option.toString());
        for (let _m = 0; _m < this.showMatchesIdPrimary.length; _m++) {
          this.results[_m] = {
            winner: this.showMatchesIdPrimary[_m][Math.floor(Math.random() * 2) + 0]
          };
        }
        // adding ghosts of principal tournament with the winner no ghost
        for (let _g = 0; _g < this.ghostsPrimary.length; _g++) {
          this.ghostsPrimary[_g][0] === 0 ?
            this.results.push({ winner: this.ghostsPrimary[_g][1] }) : this.results.push({ winner: this.ghostsPrimary[_g][0] });
          this.matchesIdPrimary.push(this.ghostsPrimary[_g][2]); // adding id ghost matches
        }
        // The same with the secondary tournament
        for (let _v = 0; _v < this.showMatchesIdSecondary.length; _v++) {
          this.results2[_v] = {
            winner: this.showMatchesIdSecondary[_v][Math.floor(Math.random() * 2) + 0]
          };
        }
        for (let _g = 0; _g < this.ghostsSecondary.length; _g++) {
          this.ghostsSecondary[_g][0] === 0 ?
            this.results2.push({ winner: this.ghostsSecondary[_g][1] }) : this.results2.push({ winner: this.ghostsSecondary[_g][0] });
          this.matchesIdSecondary.push(this.ghostsSecondary[_g][2]); // id ghost mtches
        }
      }
      if (this.option === 'ClasificacionPuntos') {
        for (let _m = 0; _m < this.showMatchesIdPrimary.length; _m++) {
          for (let kk = 0; kk < this.listStudentsPoints.length; kk++) {
            let name1 = (this.showMatchesIdPrimary[_m][0]).toString();
            let name2 = (this.showMatchesIdPrimary[_m][1]).toString();
            if (this.listStudentsPoints[kk].id == name1) {
              this.totalPointsplayerone = this.listStudentsPoints[kk].totalPoints;
            }
            if (this.listStudentsPoints[kk].id == name2) {
              this.totalPointsplayertwo = this.listStudentsPoints[kk].totalPoints;
            }
          }
          if (this.totalPointsplayertwo < this.totalPointsplayerone) {
            this.winnermatch = (this.showMatchesIdPrimary[_m][0]).toString();
          }
          if (this.totalPointsplayertwo > this.totalPointsplayerone) {
            this.winnermatch = (this.showMatchesIdPrimary[_m][1]).toString();
          }
          if (this.totalPointsplayertwo == this.totalPointsplayerone) {
            let wins = this.randomNumber(1, 2);
            if (wins == 1) {
              this.winnermatch = (this.showMatchesIdPrimary[_m][0]).toString();
            } else {
              this.winnermatch = (this.showMatchesIdPrimary[_m][1]).toString();
            }
          }
          this.results[_m] = {
            winner: this.winnermatch
          };
        }
        // adding ghosts of principal tournament with the winner no ghost
        for (let _g = 0; _g < this.ghostsPrimary.length; _g++) {
          this.ghostsPrimary[_g][0] === 0 ?
            this.results.push({ winner: this.ghostsPrimary[_g][1] }) : this.results.push({ winner: this.ghostsPrimary[_g][0] });
          this.matchesIdPrimary.push(this.ghostsPrimary[_g][2]); // adding id ghost matches
        }
        // The same with the secondary tournament
        for (let _v = 0; _v < this.showMatchesIdSecondary.length; _v++) {
          for (let kk = 0; kk < this.listStudentsPoints.length; kk++) {
            if (this.listStudentsPoints[kk].id == (this.showMatchesIdSecondary[_v][0]).toString()) {
              this.totalPointsplayerone = this.listStudentsPoints[kk].totalPoints;
            }
            if (this.listStudentsPoints[kk].id == (this.showMatchesIdSecondary[_v][1]).toString()) {
              this.totalPointsplayertwo = this.listStudentsPoints[kk].totalPoints;
            }
          }
          if (this.totalPointsplayertwo < this.totalPointsplayerone) {
            this.winnermatch = (this.showMatchesIdSecondary[_v][0]).toString();
          }
          if (this.totalPointsplayertwo > this.totalPointsplayerone) {
            this.winnermatch = (this.showMatchesIdSecondary[_v][1]).toString();
          }
          if (this.totalPointsplayertwo == this.totalPointsplayerone) {
            let wins = this.randomNumber(1, 2);
            if (wins == 1) {
              this.winnermatch = (this.showMatchesIdSecondary[_v][0]).toString();
            } else {
              this.winnermatch = (this.showMatchesIdSecondary[_v][1]).toString();
            }
          }
          this.results2[_v] = {
            winner: this.winnermatch
          };
        }
      }
      for (let _g = 0; _g < this.ghostsSecondary.length; _g++) {
        this.ghostsSecondary[_g][0] === 0 ?
          this.results2.push({ winner: this.ghostsSecondary[_g][1] }) : this.results2.push({ winner: this.ghostsSecondary[_g][0] });
        this.matchesIdSecondary.push(this.ghostsSecondary[_g][2]); // id ghost mtches
      }
    } else {
      // converts the name: { winner: 10000 }
      for (let _v = 0; _v < value.results.length; _v++) {
        let index = this.showMatchesPrimary[_v].indexOf(value.results[_v].winner);
        this.results[_v] = { winner: this.showMatchesIdPrimary[_v][index] };
      }
      // adding ghosts of principal tournament with the winner no ghost
      for (let _g = 0; _g < this.ghostsPrimary.length; _g++) {
        this.ghostsPrimary[_g][0] === 0 ?
          this.results.push({ winner: this.ghostsPrimary[_g][1] }) : this.results.push({ winner: this.ghostsPrimary[_g][0] });
        this.matchesIdPrimary.push(this.ghostsPrimary[_g][2]); // id ghost matches
      }
      // here we have the firt part with and without ghosts

      // the same for the secondary tournament
      for (let _v = 0; _v < value.results2.length; _v++) {
        let index = this.showMatchesSecondary[_v].indexOf(value.results2[_v].winner);
        this.results2[_v] = { winner: this.showMatchesIdSecondary[_v][index] };
      }
      for (let _g = 0; _g < this.ghostsSecondary.length; _g++) {
        this.ghostsSecondary[_g][0] === 0 ?
          this.results2.push({ winner: this.ghostsSecondary[_g][1] }) : this.results2.push({ winner: this.ghostsSecondary[_g][0] });
        this.matchesIdSecondary.push(this.ghostsSecondary[_g][2]); // id ghost matches
      }
    }

    const allResults = this.results.concat(this.results2);
    const allMatches = this.matchesIdPrimary.concat(this.matchesIdSecondary);

    for (let _m = 0; _m < allResults.length; _m++) {
      this.matchesService.putWinner(allResults[_m], allMatches[_m])
        .subscribe((match => {
          this.postMatches.push(match);
          if (this.postMatches.length === allResults.length) {
            this.postMatches.sort(function (a, b) { return (+a.id - +b.id); });
            this.alertService.show(this.translateService.instant('COMPETITION_CREATION.UPDATED_RESULTS'));
            this.matchesUploaded = true;
            if ((this.lastJourney + 1) !== this.journeys.length) {
              this.postNextJourney();
            } else { this.loadingService.hide(); }
          }
        }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
    }
    const url = this.route.snapshot.url.join('/') + '/automation2';
    this.router.navigate([url]);
  }

  postNextJourney() {
    this.principalMatches = [];
    this.secondaryMatches = [];
    this.submitMatches = [];
    if ((this.lastJourney + 1) % 2 !== 0) { // odd journey: the next journey will have 2 tournaments
      if (this.lastJourney === 0) {
        for (let _m = 0; _m < this.postMatches.length; _m++) {
          if (this.postMatches[_m].winner === this.postMatches[_m].playerOne) {
            this.principalMatches.push(this.postMatches[_m].playerOne);
            this.secondaryMatches.push(this.postMatches[_m].playerTwo);
          } else {
            this.principalMatches.push(this.postMatches[_m].playerTwo);
            this.secondaryMatches.push(this.postMatches[_m].playerOne);
          }
        }
      } else {
        for (let _m = 0; _m < (this.matchesJourneys[this.lastJourney - 1].length / 2); _m++) {
          this.matchesJourneys[this.lastJourney - 1][_m].winner === this.matchesJourneys[this.lastJourney - 1][_m].playerOne ?
            this.principalMatches.push(this.matchesJourneys[this.lastJourney - 1][_m].playerOne) :
            this.principalMatches.push(this.matchesJourneys[this.lastJourney - 1][_m].playerTwo);
        }
        for (let _m = 0; _m < this.postMatches.length; _m++) {
          this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
            this.secondaryMatches.push(this.postMatches[_m].playerOne) :
            this.secondaryMatches.push(this.postMatches[_m].playerTwo);
        }
      }
      this.submitMatches = this.principalMatches.concat(this.secondaryMatches);
    } else if ((this.lastJourney + 1) % 2 === 0) {
      for (let _m = 0; _m < this.postMatches.length; _m++) {
        if (_m < (this.postMatches.length / 2)) {
          this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
            this.secondaryMatches.push(this.postMatches[_m].playerTwo) :
            this.secondaryMatches.push(this.postMatches[_m].playerOne);
        } else {
          this.postMatches[_m].winner === this.postMatches[_m].playerOne ?
            this.secondaryMatches.push(this.postMatches[_m].playerOne) :
            this.secondaryMatches.push(this.postMatches[_m].playerTwo);
        }
      }
      this.submitMatches = this.secondaryMatches;
    }

    let countMatches = 0;

    for (let _s = 0; _s < this.secondaryMatches.length; _s += 2) {
      this.match1 = {
        playerOne: +this.submitMatches[_s],
        playerTwo: +this.submitMatches[_s + 1],
        journeyId: +this.journeys[this.lastJourney + 1].id
      };
      // POST MATCHES
      this.matchesService.postMatch(this.match1)
        .subscribe((match => {
          countMatches++;
          if (countMatches === (this.secondaryMatches.length / 2)) {
            if ((this.lastJourney + 1) % 2 !== 0) {
              this.postSecondaryTournament();
            } else {
              this.loadingService.hide();
              this.alertService.show(this.translateService.instant('TENNIS.UPDATED_MATCHES'));
            }
          }
          if ((this.lastJourney + 1) === (this.journeys.length - 1)) {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('TENNIS.UPDATED_MATCH'));
          }
        }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
    }
  }

  public randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }

  postSecondaryTournament() {
    let countMatches = 0;
    for (let _s = 0; _s < this.secondaryMatches.length; _s += 2) {
      this.match1 = {
        playerOne: +this.secondaryMatches[_s],
        playerTwo: +this.secondaryMatches[_s + 1],
        journeyId: +this.journeys[this.lastJourney + 1].id
      };
      // POST MATCHES
      this.matchesService.postMatch(this.match1)
        .subscribe((match => {
          countMatches++;
          if (countMatches === (this.secondaryMatches.length / 2)) {
            this.loadingService.hide();
            this.alertService.show(this.translateService.instant('TENNIS.UPDATED_MATCHES'));
          }
        }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
    }
  }

  showInformation() {
    this.show === true ? this.show = false : this.show = true;
  }

  showResults() {
    this.option = 'Manualmente';
  }

  showResults2() {
    this.option = 'Aleatoriamente';
  }

  showResults3() {
    this.option = 'ClasificacionPuntos';
    this.getpoints(this.competition.groupId)
  }

  gotoTournament() {
    const url = this.route.snapshot.url.join('/') + '/tournaments';
    this.router.navigate([url]);
  }

  gotoJourneys() {
    const url = this.route.snapshot.url.join('/') + '/journeys';
    this.router.navigate([url]);
  }

  gotoTeams() {
    const url = this.route.snapshot.url.join('/') + '/teams';
    this.router.navigate([url]);
  }

  deleteCompetition() {
    const dialogRef = this.dialog.open(DeleteCompetitionComponent, {
      data: { competition: this.competition, journeys: this.journeys }
    });
  }

}
export interface Score {
  nameees: string;
  position: number;
  points: number;
  currentuser: Boolean;
  studentId: string;
}
