import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { TeacherService, AlertService, AvatarService, UtilsService, LoadingService } from '../../shared/services';
import { AppConfig } from '../../app.config';
import { Teacher, Avatar, Login, Credentials } from '../../shared/models';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit, OnChanges {

  @Input() editTeacher: Teacher;
  @Input() schoolId: number;
  newTeacher = new Teacher();
  @Output() newTeacherChange = new EventEmitter<Teacher>();
  avatars: Avatar[];
  credentials = new Credentials();

  constructor(
    public teacherService: TeacherService,
    public avatarService: AvatarService,
    public utilsService: UtilsService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService
  ) {
    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit() {
    this.getAvatars();
  }

  ngOnChanges(changes: SimpleChanges) {

    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];
      const curVal = JSON.stringify(change.currentValue);
      const prevVal = JSON.stringify(change.previousValue);

      if (propName === 'editTeacher') {
        if (this.editTeacher !== undefined) {
          this.newTeacher = this.editTeacher;
        }
      }
    }
  }

  getAvatars() {
    this.avatarService.getAllAvatars().subscribe(
      (avatars: Avatar[]) => {
        this.avatars = avatars;
      }
    );
  }

  saveTeacher() {
    this.newTeacher.schoolId = this.schoolId;

    this.teacherService.postTeacher(this.newTeacher).subscribe(
      ((teacher: Teacher) => {
        if (this.newTeacher.id === undefined) {
          this.newTeacherChange.emit(teacher);
          this.alertService.show(this.translateService.instant('TEACHER.CREATED'));
        } else {
          this.alertService.show(this.translateService.instant('TEACHER.EDITED'));
          this.newTeacher = new Teacher();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      })
    );

  }

}
