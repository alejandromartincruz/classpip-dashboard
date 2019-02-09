import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Teacher, Group } from '../../../shared/models';
import { GroupService, AlertService, LoadingService } from '../../../shared/services';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-groups-form',
  templateUrl: './groups-form.component.html',
  styleUrls: ['./groups-form.component.scss']
})
export class GroupsFormComponent implements OnInit, OnChanges {

  @Input() teachers: Teacher[];
  @Input() schoolId: number;
  @Input() matterId: number;
  @Input() gradeId: number;
  newGroup = new Group();
  @Output() newGroupChange = new EventEmitter<Group>();

  constructor(
    public groupService: GroupService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) { }

  saveGroup(gradeId: number, matterId: number) {
    this.newGroup.schoolId = this.schoolId;
    this.newGroup.gradeId = gradeId;
    this.newGroup.matterId = matterId;

    this.groupService.postGroup(this.newGroup).subscribe(
      (group: Group) => {
        this.alertService.show(this.translateService.instant('GROUPS.CREATED'));
        this.newGroupChange.emit(group);
      }
    );
  }

}
