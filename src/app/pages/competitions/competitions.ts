import { Component, OnInit} from '@angular/core';

import { Login, Competition, Role, Team, Group } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, CompetitionService,
  TeamService, AlertService, GroupService } from '../../shared/services/index';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.html',
  styleUrls: ['./competitions.scss']
})
export class CompetitionsComponent implements OnInit {

  public competitions: Array<Competition>;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService,
    public competitionService: CompetitionService,
    public teamService: TeamService) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
      this.competitions = [];
    }

  ngOnInit() {
    if (this.utilsService.role === Role.TEACHER) {
      this.getTeacherCompetitions();
    } else if (this.utilsService.role === Role.STUDENT) {
      this.getStudentCompetitions();
    }
  }
  /**
   * This method returns the list of competitions from the
   * backend. This call is called by the teacher
   */
  getTeacherCompetitions(): void {
    this.groupService.getMyGroups().subscribe(
      ((groups: Array<Group>) =>
      groups.map( group => {
        this.competitionService.getMyCompetitionsByGroup(group).subscribe(
          ((competitions: Array<Competition>) =>
          competitions.map( competition => {
            this.loadingService.show();
            this.competitions.push(competition);
            this.loadingService.hide();
          })),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          }));
      })),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }
  /**
   * This method returns the list of competitions from the
   * backend. This call is called by the student
   */
  getStudentCompetitions(): void {
    this.competitionService.getMyCompetitions().subscribe(
      ((competitions: Array<Competition>) =>
      competitions.map( competition => {
        this.loadingService.show();
          this.competitions.push(competition);
        this.loadingService.hide();
      })),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    this.teamService.getTeamsStudent(+this.utilsService.currentUser.userId).subscribe(
      ((teams: Array<Team>) =>
      teams.map( team => {
          this.teamService.getMyCompetitionsGroup(+team.id).subscribe(
            ((competitions: Array<Competition>) =>
            competitions.map( competition => {
              this.loadingService.show();
                this.competitions.push(competition);
                this.loadingService.hide();
            })),
            ((error: Response) => {
              this.loadingService.hide();
              this.alertService.show(error.toString());
            }));
        this.loadingService.hide();
      })),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

}
