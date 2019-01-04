import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import {
  SchoolService, UserService, LoadingService,
  AlertService, UtilsService, TeacherService
} from '../../shared/services';
import {
  School, Login, Profile, Teacher
} from '../../shared/models/index';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { TranslateService } from 'ng2-translate';
import { Location } from '@angular/common';

@Component({
  selector: 'app-school-details',
  templateUrl: './school-details.component.html',
  styleUrls: ['./school-details.component.scss']
})
export class SchoolDetailsComponent implements OnInit {

  public school: School;
  public profile: Profile;
  public backgroundImg: SafeStyle;
  public pageSizeInit = 10;
  public length: number;
  public pageSizeOptions = [5, 10, 25, 100];
  public pageEvent: PageEvent;
  public dialogRef: MatDialogRef<ConfirmationDialogComponent>;
  public editTeacher: Teacher;

  constructor(
    private route: ActivatedRoute,
    public schoolService: SchoolService,
    public userService: UserService,
    public loadingService: LoadingService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public teacherService: TeacherService,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public translateService: TranslateService,
    public location: Location
  ) {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit() {
    this.loadingService.show();

    this.route.params.subscribe(params => {
      this.getSchool(params['id']);
    });
  }

  getSchool(schoolId: number) {
    const filterParams = '?filter=%7B%22include%22%3A%5B%22teachers%22%2C%22students%22%5D%7D';
    this.schoolService.getschool(schoolId, filterParams).subscribe(
      (school: School) => {
        this.school = school;
        this.backgroundImg = this.getStyle(school.imageBig);
        this.length = school.teachers.length;
        this.pageEvent = new PageEvent;
        this.pageEvent.pageIndex = 0;
        this.pageEvent.pageSize = this.pageSizeInit;
        this.pageEvent.length = this.length;
        this.loadingService.hide();
      }
    );
  }

  editTeacherAction(teacherId: number) {
    this.editTeacher = this.school.teachers.filter(teacher => parseInt(teacher.id, 10) === teacherId)[0];
    document.getElementById('teacherForm').scrollIntoView();
  }

  openDeleteTeacherDialog(teacherId: number) {

    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });

    this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('TEACHER.CONFIRMDELETE', { teacherId });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        this.teacherService.deleteTeacher(teacherId).subscribe(response => {
          this.school.teachers = this.school.teachers.filter(teacher => parseInt(teacher.id, 10) !== teacherId);
          this.alertService.show(this.translateService.instant('TEACHER.DELETED'));
        });
      }
      this.dialogRef = null;
    });

  }

  scrollToForm() {
    this.editTeacher = new Teacher;
    document.getElementById('teacherForm').scrollIntoView();
  }

  newTeacherHandler(newTeacherGenerated) {
    this.school.teachers.push(newTeacherGenerated);
    this.pageEvent.length += 1;
  }

  paginationFrom(pageEvent) {
    return ((pageEvent.pageIndex === 0) ? pageEvent.pageIndex : (pageEvent.pageIndex) * pageEvent.pageSize);
  }

  paginationTo(pageEvent) {
    return this.paginationFrom(pageEvent) + pageEvent.pageSize;
  }

  goBack() {
    this.location.back();
  }

  private getStyle(url: string) {

    const profilePicUrl = url;
    const style = `linear-gradient(
        rgba(0, 0, 0, 0.5),
        rgba(0, 0, 0, 0.5)
      ),
      url(${profilePicUrl})`;

    // sanitize the style expression
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}
