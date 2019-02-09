import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterService, GradeService, AlertService, LoadingService } from '../../../shared/services';
import { Matter, Grade } from '../../../shared/models';
import { MatterGradeRel } from '../../../shared/models/matterGradeRel';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-grade-matter-rel',
  templateUrl: './grade-matter-rel.component.html',
  styleUrls: ['./grade-matter-rel.component.scss']
})
export class GradeMatterRelComponent implements OnInit {

  @Input() grade: Grade;
  @Output() newRel = new EventEmitter<MatterGradeRel>();
  public matters: Matter[];
  public gradeMatterRel = new MatterGradeRel;

  constructor(
    public matterService: MatterService,
    public gradeService: GradeService,
    public alertService: AlertService,
    public translateService: TranslateService,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.matterService.getMatters().subscribe(
      (matters: Matter[]) => {
        this.matters = matters;
      }
    );
  }

  saveGradeMatterRel() {
    this.gradeService.saveGradeMatterRel(this.gradeMatterRel.gradeId, this.gradeMatterRel.matterId).subscribe(
      (rel: MatterGradeRel) => {
        this.alertService.show(this.translateService.instant('GRADE.ADDMATTER'));
        this.newRel.emit(rel);
      }
    );

  }

  selectedMatter(gradeId) {
    this.gradeMatterRel.gradeId = gradeId;
  }

  checkMatterAvailavility(matterId: number, matterArray: Matter[]): boolean {
    let isAvailable = true;
    matterArray.forEach(function (matter) {
      if (parseInt(matter.id, 10) === matterId) {
        isAvailable = false;
      }
    });
    return isAvailable;
  }
}
