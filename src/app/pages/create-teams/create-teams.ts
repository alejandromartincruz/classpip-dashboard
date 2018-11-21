import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';

import { AlertService, UtilsService, LoadingService, GroupService,
        CompetitionService, TeamService} from '../../shared/services/index';
import { Login, Role, Group, Student, Team } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'app-create-teams',
  templateUrl: './create-teams.html',
  styleUrls: ['./create-teams.scss']
})
export class CreateTeamsComponent implements OnInit {

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public show = 1;
  public groups = [];
  public team: any;
  public teams = new Array();

  public students = new Array<Student>();
  public numStudents: number;

  constructor( public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public teamService: TeamService,
    private _formBuilder: FormBuilder) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
     }

  ngOnInit() {

    if (this.utilsService.role === Role.TEACHER) {
    this.firstFormGroup = this._formBuilder.group({
      groupId: ['', Validators.required],
      teams: this._formBuilder.array([
        this._formBuilder.group({
          name: ['', Validators.required]
        })
      ])
    });
    this.secondFormGroup = this._formBuilder.group({
      teamsId: this._formBuilder.array([
        this._formBuilder.group({
          teamId: ['', Validators.required]
        })
      ])
    });

    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.push(this._formBuilder.group({
      name: ['', Validators.required]
    }));

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
   * This method submits the list of teams with the group
   * and gets the students for the next step
   */
  onSubmit(value) {
    this.loadingService.show();
        for (let _m = 0; _m < (value.teams.length); _m++) {
         this.team = {
          name: value.teams[_m].name,
          groupId: value.groupId
          };
          this.teamService.postTeam(this.team)
          .subscribe( (team => {
           this.teams.push(team);
           if ( this.teams.length === value.teams.length - 1 ) {
            this.show = this.show + 1;
           }
           this.loadingService.hide();
            }),
           ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
            }));
        }
      // GET STUDENTS of the group
      this.groupService.getMyGroupStudents(value.groupId).subscribe(
      ( (students: Array<Student>) => {
        this.students = students;
        this.numStudents = this.students.length;
        for (let _n = 0; _n < this.numStudents - 1; _n++) {
          let teamsId = <FormArray>this.secondFormGroup.get('teamsId');
          teamsId.push(this._formBuilder.group({
            teamId: ['', Validators.required]
          }));
        }
        this.show = this.show + 1;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

  }
    /**
   * This method submits the relation of each student with a team
   */
  onSubmit2(value) {
    this.loadingService.show();
      for ( let _s = 0; _s < this.numStudents; _s++ ) {
      this.teamService.relTeamStudent(value.teamsId[_s].teamId, this.students[_s].id).subscribe(
        ( res => {
          if ( _s === this.numStudents - 1 ) { this.show = this.show + 1; }
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
  }
      /**
   * Remove a team
   */
  removeTeam(i) {
    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.removeAt(i);
  }
    /**
   * Add a team
   */
  addTeam() {
    let teams = <FormArray>this.firstFormGroup.get('teams');
    teams.push(this._formBuilder.group({
      name: ['', Validators.required]
    }));
  }
  /**
   * This method returns the list of students of the group.
   * This call is called by the template of create-teams.
   */
  getValue(i: number) {
    return (this.students[i].name);
  }

}
