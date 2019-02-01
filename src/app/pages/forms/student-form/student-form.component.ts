import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AlertService, LoadingService, LevelService, AvatarService, RewardService } from '../../../shared/services';
import { Student, Avatar } from '../../../shared/models';
import { StudentService } from '../../../shared/services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit, OnChanges {

  @Input() students: Student[];
  @Input() editStudent: Student;
  @Input() schoolId: number;
  newStudent = new Student();
  @Output() newStudentChange = new EventEmitter<Student>();
  avatars: Avatar[];

  constructor(
    public studentService: StudentService,
    public levelService: LevelService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService,
    public avatarService: AvatarService,
    public rewardServide: RewardService
  ) { }

  ngOnInit() {
    this.getAvatars();
  }

  ngOnChanges(changes: SimpleChanges) {

    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];
      const curVal = JSON.stringify(change.currentValue);
      const prevVal = JSON.stringify(change.previousValue);

      if (propName === 'editStudent') {
        if (this.editStudent !== undefined) {
          this.newStudent = this.editStudent;
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

  saveStudent() {
    this.newStudent.schoolId = this.schoolId;

    this.studentService.postStudent(this.newStudent).subscribe(
      ((student: Student) => {
        if (this.newStudent.id === undefined) {
          this.rewardServide.newReward(student.id);
          this.newStudentChange.emit(student);
          this.alertService.show(this.translateService.instant('STUDIENT.CREATED'));
        } else {
          this.alertService.show(this.translateService.instant('STUDIENT.EDITED'));
          this.newStudent = new Student();
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      })
    );

  }

}

