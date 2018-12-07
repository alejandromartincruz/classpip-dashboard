import { Component } from '@angular/core';
import { Login, Group, Role, Questionnaire, ResultPoints, Point, Badge, Student, PointRelation, BadgeRelation, ResultBadges } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, BadgeRelationService, GroupService, AlertService, PointRelationService, PointService, BadgeService, SchoolService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
// export interface Food {
//   value: string;
//   viewValue: string;
// }
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavBarComponent {
  public groupSelected: string;
  public mygroups: Array<Group>;
  public isTeacher: boolean;
  // public groupSelected: string;
  public groupSelectedList: string;
  // foods: Food[] = [
  //   {value: 'steak-0', viewValue: 'Steak'},
  //   {value: 'pizza-1', viewValue: 'Pizza'},
  //   {value: 'tacos-2', viewValue: 'Tacos'}
  // ];
  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public groupService: GroupService,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public loadingService: LoadingService
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacher = true;
    }
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
