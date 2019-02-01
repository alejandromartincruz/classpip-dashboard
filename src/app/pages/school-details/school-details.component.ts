import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../app.config';
import {
  SchoolService, UserService, LoadingService,
  AlertService, UtilsService, TeacherService,
  GradeService, MatterService, LevelService,
  StudentService, RewardService
} from '../../shared/services';
import {
  School, Login, Profile,
  Teacher, Grade, Matter,
  Student, Rango
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
  public editGrade: Grade;
  public editMatter: Matter;
  public editRank: Rango;
  public editStudent: Student;
  public gradeMatters: Grade[];

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
    public location: Location,
    public gradeService: GradeService,
    public matterService: MatterService,
    public levelService: LevelService,
    public studentService: StudentService,
    public rewardService: RewardService
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
    // tslint:disable-next-line:max-line-length
    const filterParams = '?filter=%7B%22include%22%3A%20%5B%22teachers%22%2C%22students%22%2C%22grades%22%2C%22matters%22%2C%22ranges%22%5D%7D';
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

  editAction(elementId: number, formId: string) {
    if (formId === 'teacherForm') {
      this.editTeacher = this.school.teachers.filter(teacher => parseInt(teacher.id, 10) === elementId)[0];
    } else if (formId === 'gradeForm') {
      this.editGrade = this.school.grades.filter(grade => parseInt(grade.id, 10) === elementId)[0];
    } else if (formId === 'matterForm') {
      this.editMatter = this.school.matters.filter(matter => parseInt(matter.id, 10) === elementId)[0];
    } else if (formId === 'rankForm') {
      this.editRank = this.school.ranges.filter(rank => parseInt(rank.id, 10) === elementId)[0];
    } else if (formId === 'studentForm') {
      this.editStudent = this.school.students.filter(student => parseInt(student.id, 10) === elementId)[0];
    }
    document.getElementById(formId).scrollIntoView();
  }

  openDeleteDialog(elementId: number, formId: string) {

    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false
    });

    if (formId === 'teacherForm') {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('TEACHER.CONFIRMDELETE', { elementId });
    } else if (formId === 'gradeForm') {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('GRADE.CONFIRMDELETE', { elementId });
    } else if (formId === 'matterForm') {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('MATTER.CONFIRMDELETE', { elementId });
    } else if (formId === 'rankForm') {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('RANKS.CONFIRMDELETE', { elementId });
    } else if (formId === 'studentForm') {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('STUDIENTS.CONFIRMDELETE', { elementId });
    } else if (formId.indexOf('gradeMatterRelForm') >= 0) {
      this.dialogRef.componentInstance.confirmMessage = this.translateService.instant('GRADE.CONFIRMRELDELETE', { elementId });
    }

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // do confirmation actions
        if (formId === 'teacherForm') {
          this.teacherService.deleteTeacher(elementId).subscribe(response => {
            this.school.teachers = this.school.teachers.filter(teacher => parseInt(teacher.id, 10) !== elementId);
            this.alertService.show(this.translateService.instant('TEACHER.DELETED'));
          });
        } else if (formId === 'gradeForm') {
          this.gradeService.deleteGrade(elementId).subscribe(response => {
            this.school.grades = this.school.grades.filter(grade => parseInt(grade.id, 10) !== elementId);
            this.alertService.show(this.translateService.instant('GRADE.DELETED'));
          });
        } else if (formId === 'matterForm') {
          this.matterService.deleteMatter(elementId).subscribe(response => {
            this.school.matters = this.school.matters.filter(matter => parseInt(matter.id, 10) !== elementId);
            this.alertService.show(this.translateService.instant('MATTER.DELETED'));
          });
        } else if (formId === 'rankForm') {
          this.levelService.deleteRank(elementId).subscribe(response => {
            this.school.ranges = this.school.ranges.filter(rank => parseInt(rank.id, 10) !== elementId);
            this.alertService.show(this.translateService.instant('RANKS.DELETED'));
          });
        } else if (formId === 'studentForm') {
          this.studentService.deleteStudent(elementId).subscribe(response => {
            this.rewardService.deleteReward(elementId);
            this.school.students = this.school.students.filter(student => parseInt(student.id, 10) !== elementId);
            this.alertService.show(this.translateService.instant('STUDIENTS.DELETED'));
          });
        } else if (formId.indexOf('gradeMatterRelForm') >= 0) {
          const gradeId = parseInt(formId.slice(-1), 10);
          const matterId = elementId;

          this.gradeService.deleteRel(gradeId, matterId).subscribe(
            (response) => {
              this.gradeService.getGradesWithMatters(parseInt(this.school.id, 10)).subscribe(
                (grades: Grade[]) => {
                  this.gradeMatters = grades;
                }
              );
            }
          );
        }
      }
      this.dialogRef = null;
    });

  }

  scrollToForm(formId: string) {

    if (formId === 'teacherForm') {
      this.editTeacher = new Teacher;
    } else if (formId === 'gradeForm') {
      this.editGrade = new Grade;
    } else if (formId === 'matterForm') {
      this.editMatter = new Matter;
    } else if (formId === 'rankForm') {
      this.editRank = new Rango;
    } else if (formId === 'studentForm') {
      this.editStudent = new Student;
    }
    document.getElementById(formId).scrollIntoView();
  }

  newTeacherHandler(newTeacherGenerated) {
    this.school.teachers.push(newTeacherGenerated);
    this.pageEvent.length += 1;
    this.editTeacher = new Teacher;
  }

  newGradeHandler(newGradeGenerated) {
    this.school.grades.push(newGradeGenerated);
    this.editGrade = new Grade;
  }

  newMatterHandler(newMatterGenerated) {
    this.school.matters.push(newMatterGenerated);
    this.editMatter = new Matter;
  }

  newRankHandler(newRankGenerated) {
    this.school.ranges.push(newRankGenerated);
    this.editRank = new Rango;
  }

  newStudentHandler(newStudentGenerated) {
    this.school.students.push(newStudentGenerated);
    this.editStudent = new Student;
  }

  newRelHandler(newRel) {
    this.gradeService.getGradesWithMatters(parseInt(this.school.id, 10)).subscribe(
      (grades: Grade[]) => {
        this.gradeMatters = grades;
      }
    );
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

  tabClick(tab) {
    if (tab.index === 3) {
      this.gradeService.getGradesWithMatters(parseInt(this.school.id, 10)).subscribe(
        (grades: Grade[]) => {
          this.gradeMatters = grades;
        }
      );
    }
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
