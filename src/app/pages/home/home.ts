import { Component, OnInit } from '@angular/core';
import {
  School, Role, Login,
  Profile, Rango, BadgeRelation,
  Badge
} from '../../shared/models/index';
// tslint:disable-next-line:max-line-length
import {
  UtilsService, SchoolService, AlertService,
  LoadingService, UserService, PointRelationService,
  LevelService, BadgeRelationService
} from '../../shared/services/index';
import { AppConfig } from '../../app.config';
import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  public profile: Profile;
  public school: School;
  public myPoints: Number;
  public isStudentProfile = false;
  public isTeacherProfile = false;
  public level: Number;
  public rank: Rango;
  public nextLevelPoints: number;
  public listBadges: Array<Badge>;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public translateService: TranslateService,
    public loadingService: LoadingService,
    public userService: UserService,
    public pointRelationService: PointRelationService,
    public levelService: LevelService,
    public badgeRelationService: BadgeRelationService
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

    this.loadingService.show();
    this.userService.getMyProfile().subscribe(
      ((profile: Profile) => {
        this.profile = profile;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacherProfile = true;
      this.schoolService.getMySchool().subscribe(
        ((school: School) => {
          this.loadingService.hide();
          this.school = school;
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }

    if (this.utilsService.role === Role.STUDENT) {
      this.isStudentProfile = true;
      this.pointRelationService.getMyPointsNumber()
        .subscribe((totalPoints => {
          this.myPoints = totalPoints;
          this.level = this.levelService.getLevel(totalPoints);
          this.rank = this.levelService.getRank(totalPoints);
          this.nextLevelPoints = this.levelService.getNextLevelPoints(totalPoints);
        }),
          ((error: Response) => {
            this.loadingService.hide();
            this.alertService.show(error.toString());
          })
        );
      this.getStudentBadges();
      this.schoolService.getMySchool().subscribe(
        ((school: School) => {
          this.loadingService.hide();
          this.school = school;
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  getStudentBadges() {
    this.badgeRelationService.getMyBadges().subscribe((badges: Badge[]) => {
      this.listBadges = badges;
      this.listBadges.slice(0, 5);
    });
  }

}
