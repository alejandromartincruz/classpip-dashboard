import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { MatSelectChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Response } from '@angular/http';

import { Credentials, Role, Login } from '../../shared/models/index';
import { UtilsService, LoginService, LoadingService, AlertService } from '../../shared/services/index';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

  public credentials: Credentials = new Credentials();
  public role: Role = Role.TEACHER;
  public roles: Array<Object>;
  private returnUrl: string;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public loginService: LoginService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public translateService: TranslateService,
    public alertService: AlertService) {
  }

  ngOnInit(): void {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Configure the default role on the utils service
    this.role = Role.TEACHER;
    this.utilsService.role = this.role;

    // logout if the current user is loggged
    if (localStorage.getItem(AppConfig.LS_USER)) {
      this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
      this.loginService.logout().finally(() => {
        localStorage.removeItem(AppConfig.LS_USER);
        localStorage.removeItem(AppConfig.LS_ROLE);
      }).subscribe();
    }

    this.translateService.get(['LOGIN.STUDENT', 'LOGIN.TEACHER', 'LOGIN.SCHOOLADMIN']).subscribe(values => {
      this.roles = new Array<Object>();
      this.roles.push({ id: Role.STUDENT, name: values['LOGIN.STUDENT'] });
      this.roles.push({ id: Role.TEACHER, name: values['LOGIN.TEACHER'] });
      this.roles.push({ id: Role.SCHOOLADMIN, name: values['LOGIN.SCHOOLADMIN'] });
    });

    // TODO: remove this:
    this.credentials.username = 'teacher-1';
    this.credentials.password = 'teacher-1';
  }

  /**
   * Method for performing a login against the backend. If it OK will
   * redirect from the comming URL, if not, will prompt an error
   */
  public login(form: NgForm): void {

    this.loadingService.show();

    this.loginService.login(this.credentials).subscribe(
      ((data: Response) => {

        localStorage.setItem(AppConfig.LS_USER, JSON.stringify(data.json()));
        localStorage.setItem(AppConfig.LS_ROLE, JSON.stringify(this.role));

        this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
        this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

        this.router.navigate([this.returnUrl]);
        this.loadingService.hide();

      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));
  }

  public roleChange(event: MatSelectChange): void {

    this.utilsService.role = event.value;

    // TODO: remove this
    switch (event.value) {
      case Role.TEACHER:
        this.credentials.username = 'teacher-1';
        this.credentials.password = 'teacher-1';
        break;
      case Role.STUDENT:
        this.credentials.username = 'student-1';
        this.credentials.password = 'student-1';
        break;
      case Role.SCHOOLADMIN:
        this.credentials.username = 'school-admin-1';
        this.credentials.password = 'school-admin-1';
        break;
      default:
        break;
    }
  }
}
