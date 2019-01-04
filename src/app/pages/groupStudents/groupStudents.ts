import { Component, OnInit } from '@angular/core';
import { Login, Group, Role, Student } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService } from '../../shared/services/index';
import { Route, ActivatedRoute, Router } from '@angular/router';

@Component({
  // selector: 'app-groups',
  templateUrl: './groupStudents.html',
  styleUrls: ['./groupStudents.scss']
})
export class GroupStudentsComponent implements OnInit {
  public groupId: string;
  public students: Array<Student>;
  public sub: any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public groupService: GroupService) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

  }

  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {
      this.groupId = params['id'];
    });
    if (this.utilsService.role === Role.TEACHER) {

      this.loadingService.show();
      this.groupService.getMyGroupStudents(this.groupId).subscribe(
        ((st: Array<Student>) => {
          this.students = st.sort((n1, n2) => +n1.id - +n2.id);
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }



}
