import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { School } from '../../../shared/models';
import { SchoolService, AlertService } from '../../../shared/services';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-school-form',
  templateUrl: './school-form.component.html',
  styleUrls: ['./school-form.component.scss']
})
export class SchoolFormComponent implements OnInit, OnChanges {

  @Input() editSchool: School;
  newSchool = new School();
  @Output() newSchoolChange = new EventEmitter<School>();

  constructor(
    public schoolService: SchoolService,
    public alertService: AlertService,
    public translateService: TranslateService
  ) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];
      const curVal = JSON.stringify(change.currentValue);
      const prevVal = JSON.stringify(change.previousValue);

      if (propName === 'editSchool') {
        if (this.editSchool !== undefined) {
          this.newSchool = this.editSchool;
        }
      }
    }
  }

  saveSchool() {
    if (this.newSchool.id === undefined) {
      this.schoolService.postSchool(this.newSchool).subscribe(
        (school: School) => {
          this.newSchoolChange.emit(school);
          this.alertService.show(this.translateService.instant('SCHOOL.CREATED'));
          this.newSchool = new School;
        }
      );
    } else {
      this.schoolService.patchSchool(this.newSchool).subscribe(
        (school: School) => {
          this.alertService.show(this.translateService.instant('SCHOOL.EDITED'));
        }
      );

    }

  }
}
