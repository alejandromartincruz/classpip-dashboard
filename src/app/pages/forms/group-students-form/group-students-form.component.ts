import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Group, Student } from '../../../shared/models';
import { GroupService, AlertService, LoadingService } from '../../../shared/services';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-group-students-form',
  templateUrl: './group-students-form.component.html',
  styleUrls: ['./group-students-form.component.scss']
})
export class GroupStudentsFormComponent implements OnInit, OnChanges {

  @Input() students: Student[];
  @Input() schoolId: number;
  @Input() group: Group;
  @Output() newGroupStudentChange = new EventEmitter<{}>();
  studentRelId: number;

  constructor(
    public groupService: GroupService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) { }

  checkStudentAvailavility(studentId: number, groupStudents: Student[]) {

    let isAvailable = true;
    for (const student of groupStudents) {
      if (parseInt(student.id, 10) === studentId) {
        isAvailable = false;
      }
    }

    return isAvailable;
  }

  addStudentToGroup(groupId: number) {
    const postParams = new Array();
    postParams['schoolId'] = this.schoolId;
    postParams['groupId'] = groupId;
    postParams['studentId'] = this.studentRelId;

    this.groupService.addStudentToGroup(postParams).subscribe(
      (response: {}) => {
        this.alertService.show(this.translateService.instant('GROUPS.STUDENTADDED'));
        this.newGroupStudentChange.emit(response);
      }
    );
  }

}
