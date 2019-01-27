import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Login, Group, Role, Questionnaire, ResultPoints,
        Point, Badge, Student, PointRelation, BadgeRelation, ResultBadges } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, UtilsService, BadgeRelationService, GroupService,
        AlertService, PointRelationService, PointService, BadgeService, SchoolService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-assistance',
  styleUrls: ['assistance.scss'],
  templateUrl: 'assistance.html',
})
export class AssistanceComponent implements OnInit {
  displayedColumns: string[] = ['Alumno', 'Asistencia'];
  public mygroups: Array<Group>;
  public returnUrl: string;
  public mystudents: Array<Student>;
  public groupSelected: string;
  public groupSelectedList: string;
  public listStudents: Array<Student> = new Array<Student>();
  public Assistancelist: Array<Assistance> = new Array<Assistance>();
  public Assistance: Assistance;
  public yesorno: Array<Boolean>;
  public indexx: number;
  public As2: HanAsistido;
  public check_l: Boolean;
  public AssList: Array<HanAsistido> = new Array<HanAsistido>();
  public responsePointRelation: PointRelation;

  constructor(
    public translateService: TranslateService,
    public route: ActivatedRoute,
    public router: Router,
    public groupService: GroupService,
    public alertService: AlertService,
    public schoolService: SchoolService,
    public utilsService: UtilsService,
    public pointRelationService: PointRelationService,
    public loadingService: LoadingService
  ) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/assistance';
    if (this.utilsService.role === Role.TEACHER) {
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

  public showStudents() {
    this.check_l = false;
    this.listStudents = [];
    if (this.groupSelected) {
      this.groupService.getMyGroupStudents(this.groupSelected).subscribe(
        ((students: Array<Student>) => {
          this.listStudents = students;
          this.checklist();
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  public changeCheckbox(i) {
    this.Assistancelist[i].checked = !this.Assistancelist[i].checked;
  }

  public checklist() {
    this.Assistancelist = [];
    this.indexx = 0;
    for (let st of this.listStudents) {
      this.Assistance = { value: this.indexx, name: st.name.concat(' ', st.surname), studentId: st.id, checked: false };
      this.indexx = this.indexx + 1;
      this.Assistancelist.push(this.Assistance);
    }
  }

  public darpremios() {
    this.check_l = true;
    this.AssList = [];
    for (let asiste of this.Assistancelist) {
      if (asiste.checked) {
        this.As2 = { name: asiste.name, studentId: asiste.studentId, groupId: this.groupSelected,
                    schoolId: this.utilsService.currentSchool.id };
        this.AssList.push(this.As2);
        this.pointRelationService.postPointRelation('100002', asiste.studentId,
          this.utilsService.currentSchool.id, this.groupSelected, 1).subscribe(
        ((responsePointRelation: PointRelation) => {
          this.responsePointRelation = responsePointRelation;
          this.loadingService.hide();
          this.alertService.show(this.translateService.instant('POINTS.CORASSIGN'));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
      }
    }
  }
}

export interface Assistance {
  value: number
  name: string;
  studentId: string;
  checked: boolean;
}
export interface HanAsistido {
  name: string;
  studentId: string;
  groupId: string;
  schoolId: string;
}
