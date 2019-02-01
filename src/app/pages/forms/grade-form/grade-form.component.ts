import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { TeacherService, AlertService, AvatarService, UtilsService, LoadingService, GradeService } from '../../../shared/services';
import { Grade } from '../../../shared/models';

@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.scss']
})
export class GradeFormComponent implements OnInit, OnChanges {

  @Input() editGrade: Grade;
  @Input() schoolId: number;
  newGrade = new Grade();
  @Output() newGradeChange = new EventEmitter<Grade>();

  constructor(
    public gradeService: GradeService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    // tslint:disable-next-line:forin
    for (const propName in changes) {
      const change = changes[propName];
      const curVal = JSON.stringify(change.currentValue);
      const prevVal = JSON.stringify(change.previousValue);

      if (propName === 'editGrade') {
        if (this.editGrade !== undefined) {
          this.newGrade = this.editGrade;
        }
      }
    }
  }

  saveGrade() {
    this.newGrade.schoolId = this.schoolId;

    if (this.newGrade.id === undefined) {
      this.gradeService.postGrade(this.newGrade).subscribe(
        ((grade: Grade) => {
          this.newGradeChange.emit(grade);
          this.alertService.show(this.translateService.instant('GRADE.CREATED'));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        })
      );
    } else {
      this.gradeService.editGrade(this.newGrade).subscribe(
        ((grade: Grade) => {
          this.alertService.show(this.translateService.instant('GRADE.EDITED'));
          this.newGrade = new Grade();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        })
      );
    }
  }

}
