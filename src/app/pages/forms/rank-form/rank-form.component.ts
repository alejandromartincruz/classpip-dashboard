import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { AlertService, LoadingService, LevelService } from '../../../shared/services';
import { Rango } from '../../../shared/models';

@Component({
  selector: 'app-rank-form',
  templateUrl: './rank-form.component.html',
  styleUrls: ['./rank-form.component.scss']
})
export class RankFormComponent implements OnInit, OnChanges {

  @Input() ranks: Rango[];
  @Input() editRank: Rango;
  @Input() schoolId: number;
  newRank = new Rango();
  @Output() newRankChange = new EventEmitter<Rango>();

  constructor(
    public levelService: LevelService,
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

      if (propName === 'editRank') {
        if (this.editRank !== undefined) {
          this.newRank = this.editRank;
        }
      }
    }
  }

  saveRank() {
    this.newRank.schoolId = this.schoolId;

    if (this.newRank.id === undefined) {
      this.levelService.postRank(this.newRank).subscribe(
        ((rank: Rango) => {
          this.newRankChange.emit(rank);
          this.alertService.show(this.translateService.instant('RANKS.CREATED'));
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        })
      );
    } else {
      this.levelService.editRank(this.newRank).subscribe(
        ((rank: Rango) => {
          this.alertService.show(this.translateService.instant('RANKS.EDITED'));
          this.newRank = new Rango();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        })
      );
    }

  }

}
