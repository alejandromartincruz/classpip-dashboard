import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AlertService, UtilsService, LoadingService, MatterService } from '../../../shared/services';
import { Matter, Grade } from '../../../shared/models';

@Component({
  selector: 'app-matter-form',
  templateUrl: './matter-form.component.html',
  styleUrls: ['./matter-form.component.scss']
})
export class MatterFormComponent implements OnInit, OnChanges {

  @Input() editMatter: Matter;
  @Input() schoolId: number;
  @Input() grades: Grade;
  newMatter = new Matter();
  @Output() newMatterChange = new EventEmitter<Matter>();

  constructor(
    public matterService: MatterService,
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

      if (propName === 'editMatter') {
        if (this.editMatter !== undefined) {
          this.newMatter = this.editMatter;
        }
      }
    }
  }

  saveMatter() {
    this.newMatter.schoolId = this.schoolId;
    let newOne = false;
    if (this.newMatter.id === undefined) {
      newOne = true;
    }
    this.matterService.postMatter(this.newMatter).subscribe(
      ((matter: Matter) => {
        if (newOne) {
          this.newMatterChange.emit(matter);
          this.alertService.show(this.translateService.instant('MATTER.CREATED'));
        } else {
          this.alertService.show(this.translateService.instant('MATTER.EDITED'));
        }
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      })
    );
  }

}
