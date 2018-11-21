import { Component, OnInit } from '@angular/core';
import {FormControl, FormsModule, FormBuilder, FormGroup, FormArray, Validators, ControlValueAccessor} from '@angular/forms';
import { AlertService, UtilsService, LoadingService, GroupService, CompetitionService,
   JourneyService, TeamService, MatchesService} from '../../../shared/services/index';
import { Login, Role, Group, Competition, Student, Journey, Match, Team } from '../../../shared/models/index';
import { AppConfig } from '../../../app.config';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'app-create-tennis-competition',
  templateUrl: './create-tennis-competition.html',
  styleUrls: ['./create-tennis-competition.scss']
})
export class CreateTennisCompetitionComponent implements OnInit {

  public finished = false;
  public isLinear = true;

  public competitionFormGroup: FormGroup;
  public journeysFormGroup: FormGroup;
  public participantsFormGroup: FormGroup;
  public informationFormGroup: FormGroup;
  public groups = [];

  public participant: any;
  public participants = new Array<any>();
  public exp: number;
  // forms
  public newCompetition: Competition;
  public selectedParticipants: Array<number>;
  public newJourneys: Array<any>;
  public newInformation: string;
  public newCompetitionPost: Competition;
  public journeys = new Array();
  public match: any;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public journeyService: JourneyService,
    public matchesService: MatchesService,
    public teamService: TeamService,
    private _formBuilder: FormBuilder) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER) {

      // Defining 3 forms:
    this.competitionFormGroup = this._formBuilder.group({
      name: ['', Validators.required],
      groupId: ['', Validators.required],
      mode: ['', Validators.required]
    });

    this.participantsFormGroup = this._formBuilder.group({
      participantId: ['']
    });

    this.journeysFormGroup = this._formBuilder.group({
      journeys: this._formBuilder.array([
        this._formBuilder.group({
          date: ['']
        })
      ])
    });

    this.informationFormGroup = this._formBuilder.group({
      information: ['']
    });

    // Getting teacher's group
      this.loadingService.show();
      this.groupService.getMyGroups().subscribe(
        ((groups: Array<Group>) => {
          this.groups = groups;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  /**
   * This method saves the competition in a variable
   * and calls the method to get participants
   */
  competitionStep(value: Competition) {
    this.loadingService.show();
    this.newCompetition = value;
    this.newCompetition.type = 'Tenis';
    this.getParticipants(); // getting participants for the next step
  }
  /**
   * This method gets the participants of the group
   * for the competition
   */
  getParticipants(): void {
    if ( this.newCompetition.mode === 'Individual' ) {
      this.groupService.getMyGroupStudents(this.newCompetition.groupId).subscribe(
      ( (students: Array<Student>) => {
         for (let _n = 0; _n < students.length; _n++) {
         this.participant = {
          id: students[_n].id,
          name:  students[_n].name,
          surname: students[_n].surname,
          selected: false
          };
          this.participants.push(this.participant);
        }
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
      } else {
        this.groupService.getGroupTeams(this.newCompetition.groupId).subscribe(
        ( (teams: Array<Team>) => {
          for (let _a = 0; _a < teams.length; _a++) {
              this.participant = {
                id: teams[_a].id,
                name: teams[_a].name,
                surname: '',
                selected: false
                };
             this.participants.push(this.participant);
          }
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
  }
  /**
   * This method saves the participants in a variable
   * and prepares the journeys for the next step
   */
  participantStep(list) {
    this.loadingService.show();
    this.selectedParticipants = list.selectedOptions.selected.map(item => item.value);
    // Computing number of journeys and participants (Math.pow(2, exp))
      for (let _p = 1; !this.exp; _p++) {
        if ( Math.pow(2, _p) >= this.selectedParticipants.length ) {
        this.exp = _p;
        this.newCompetition.numJourneys = this.exp * 2;
        }
      }
    // Add the journeys to the next step
    for (let _n = 0; _n < this.newCompetition.numJourneys - 1; _n++) {
      let journeys = <FormArray>this.journeysFormGroup.get('journeys');
      journeys.push(this._formBuilder.group({
       date: ['']
      }));
    }
    this.loadingService.hide();
  }
  /** This method saves the journeys in a variable */
  journeyStep(value) {
    this.loadingService.show();
    this.newJourneys = value.journeys;
    this.loadingService.hide();
  }
  /**
   * This method saves the information in a variable and
   * calls the method to subit the competition
   */
  informationStep(value: Competition) {
    this.loadingService.show();
    this.newInformation = value.information;
    this.onSubmitCompetition();
  }
  /**
   * This method posts the competition
   * and calls the method to submit the journeys
   */
  onSubmitCompetition(): void {
    this.newCompetition.information = this.newInformation;
    this.competitionService.postCompetition(this.newCompetition)
    .subscribe( (competition => {
      this.newCompetitionPost = competition;
      this.onSubmitJourneys();
    }),
    ((error: Response) => {
      this.loadingService.hide();
      this.alertService.show(error.toString());
    }));
  }
 /**
   * This method posts the journeys
   * and calls the method to submit the relations
   */
  onSubmitJourneys(): void {
      // Adding to the journeys: number and competitionId
    for ( let _n = 0; _n < this.newCompetition.numJourneys; _n++) {
      this.newJourneys[_n].number = _n + 1;
      this.newJourneys[_n].competitionId = +this.newCompetitionPost.id;
      if ( this.newJourneys[_n].date === '' ) {
       this.newJourneys[_n].date = null;
      }
    }
    // POST JOURNEYS
    for (let _a = 0; _a < this.newJourneys.length; _a++) {
      this.journeyService.postJourney(this.newJourneys[_a])
        .subscribe( (journey => {
         this.journeys.push(journey);
         if (this.journeys.length === this.newJourneys.length) {
           this.journeys.sort(function (a, b) {
            return (a.number - b.number);
           });
          this.onSubmitRelations();
         }
        }),
         ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }
  /**
   * This method posts the relations beetween competition and participants
   * and calls the method to submit the journeys
   */
  onSubmitRelations(): void {
    let countParticipant = 0;
    if ( this.newCompetition.mode === 'Individual' ) {
      for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
        this.competitionService.relCompetitionStudent(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
        ( res => {
        countParticipant++;
        if ( countParticipant === this.selectedParticipants.length ) { this.putFirstMatches(); }
        }),
        ((error: Response) => {
        this.loadingService.hide();
         this.alertService.show(error.toString());
        }));
      }
    } else {
      for ( let _i = 0; _i < this.selectedParticipants.length; _i++ ) {
        this.teamService.relCompetitionTeam(this.newCompetitionPost.id, this.selectedParticipants[_i]).subscribe(
         ( res => {
         countParticipant++;
         if ( countParticipant === this.selectedParticipants.length ) { this.putFirstMatches(); }
         }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
         }));
      }
    }
  }
  /**
   * This method prepares the first matches of the competition
   * and posts the matches
   */
  putFirstMatches(): void {
    // adding ghost participant
    if (this.selectedParticipants.length !== Math.pow(2, this.exp)) {
      for (let _s = 1;  Math.pow(2, this.exp) > this.selectedParticipants.length; _s++) {
        this.selectedParticipants.push(0);
      }
    }
    this.selectedParticipants = this.selectedParticipants.sort(function() {return Math.random() - 0.5});
    let countMatches = 0;
      for (let _m = 0; _m < (this.selectedParticipants.length / 2); _m++) {
        this.match = {
          playerOne : +this.selectedParticipants[_m],
          playerTwo : +this.selectedParticipants[this.selectedParticipants.length - 1 - _m],
          journeyId : +this.journeys[0].id
        };
          // POST MATCHES
          this.matchesService.postMatch(this.match)
          .subscribe( (match => {
            countMatches++;
            if ( countMatches === (this.selectedParticipants.length / 2)) {
              this.finished = true;
              this.loadingService.hide();
              this.alertService.show('La competición se ha creado correctamente');
            }
          }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      }
    }
}
