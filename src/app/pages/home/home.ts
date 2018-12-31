import { Component, OnInit } from '@angular/core';
import {
  School, Role, Login,
  Profile, Rango, BadgeRelation,
  Badge, Point
} from '../../shared/models/index';

import {
  UtilsService, SchoolService, AlertService,
  LoadingService, UserService, PointRelationService,
  LevelService, BadgeRelationService, RewardService,
  PointService, BadgeService
} from '../../shared/services/index';
import { AppConfig } from '../../app.config';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Reward } from '../../shared/models/reward';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {

  public profile: Profile;
  public school: School;
  public schools: School[];
  public myPoints: Number;
  public isStudentProfile = false;
  public isTeacherProfile = false;
  public isAdminProfile = false;
  public level: Number;
  public rank: Rango;
  public allRanks: Array<Rango>;
  public reward: Reward;
  public nextLevelPoints: number;
  public studentBadges: Array<Badge>;
  public allBadges: Array<Badge>;
  public studentPoints: Array<Point>;
  public allPoints: Array<Point>;

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public schoolService: SchoolService,
    public translateService: TranslateService,
    public loadingService: LoadingService,
    public userService: UserService,
    public pointService: PointService,
    public pointRelationService: PointRelationService,
    public badgeService: BadgeService,
    public badgeRelationService: BadgeRelationService,
    public levelService: LevelService,
    public rewarService: RewardService
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

    this.levelService.getAllRanks()
      .subscribe((allRanks: Rango[]) => {
        allRanks.sort(this.levelService.sortFunction);
        this.allRanks = allRanks;
      });

    this.pointService.getAllPoints()
      .subscribe((allPoints: Point[]) => {
        this.allPoints = allPoints;
      });

    this.badgeService.getAllBadges()
      .subscribe((allBadges: Badge[]) => {
        this.allBadges = allBadges;
      });


    if (this.utilsService.role === Role.TEACHER) {
      this.isTeacherProfile = true;
      this.getMySchool();
    }

    if (this.utilsService.role === Role.STUDENT) {
      this.studentScreen();
      this.isStudentProfile = true;
    }

    if (this.utilsService.role === Role.SCHOOLADMIN) {
      // this.adminScreen();
      this.isAdminProfile = true;
    }
  }

  studentScreen() {

    this.isStudentProfile = true;

    this.rewarService.getStudentReward(this.utilsService.currentUser.userId).subscribe(
      (studentReward: Reward) => {
        this.reward = studentReward;
        this.rank = this.findRank();
        this.studentPoints = this.getStudentPoints(this.reward.points_obj);
      }
    );

    this.getMySchool();

  }

  findRank(): Rango {
    let actualRank: Rango;
    const rangos = this.allRanks;
    const reward = this.reward;
    Object.keys(rangos).forEach(
      function (index) {
        if (reward.rank === rangos[index].nombreRango) {
          actualRank = rangos[index];
        }
      }
    );
    return actualRank;
  }

  getStudentPoints(point_obj: string): Point[] {

    const student_points = JSON.parse(point_obj);
    const allPoints = this.allPoints;
    const result = [];

    Object.keys(student_points).forEach(
      function (index) {
        const this_point = allPoints.filter(function (point) {
          if (parseInt(point.id, 10) === parseInt(index, 10)) {
            const point_value = point.value;
            point.value = point_value * student_points[index];
            return point;
          }
        });
        if (this_point.length > 0) {
          result.push(this_point[0]);
        }
      }
    );

    return result;
  }

  getMySchool() {
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

  getStudentBadges() {
    this.badgeRelationService.getMyBadges().subscribe((badges: Badge[]) => {
      // this.listBadges = badges;
      // this.listBadges.slice(0, 5);
    });
  }



}
