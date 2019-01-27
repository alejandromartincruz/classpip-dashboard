import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, ParamMap } from '@angular/router';

import { AppConfig } from '../../../app.config';
import { Login, Role, Team, Student, Competition } from '../../../shared/models/index';
import { LoadingService, UtilsService, AlertService,
        CompetitionService, TeamService} from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.html',
  styleUrls: ['./teams.scss']
})
export class TeamsComponent implements OnInit {

  public competitionId: number;
  public competition: Competition;
  public teams: Team[];
  public allStudents: Student[][];

  constructor(public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public competitionService: CompetitionService,
    public teamService: TeamService,
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

  private getSelectedCompetition(): void {
    this.competitionService.getCompetition(this.competitionId).subscribe(
      ((competition: Competition) => {
        this.competition = competition;
        this.getTeams();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  private getTeams(): void {
    this.teamService.getTeamsCompetition(this.competitionId)
    .subscribe((teams => {
        this.teams = teams,
        this.getStudents();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  private getStudents(): void {
    let countTeams = 0;
    this.allStudents = [];
    for (let _t = 0; _t < this.teams.length; _t++) {
    this.teamService.getStudentsTeam(+this.teams[_t].id)
    .subscribe(students => {
      this.allStudents[_t] = students;
      this.teams[_t].numPlayers = students.length;
      countTeams = countTeams + 1;
      if ( countTeams === this.teams.length) { this.loadingService.hide(); }
    });
    }
  }

}
