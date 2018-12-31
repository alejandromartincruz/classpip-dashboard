import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Login, Group, Role, Questionnaire } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, BadgeService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';


@Component({
  /*selector: 'app-deleteQuestionnaire',*/
  templateUrl: './deleteBadge.html',
  styleUrls: ['./deleteBadge.scss']
})
export class DeleteBadgeComponent implements OnInit {

  public questionnaires: Array<Questionnaire>;

  animal: string;
  name: number;
  result: string;

  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public badgeService: BadgeService,

    public dialogRef: MatDialogRef<DeleteBadgeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {

  }

  cancel(): void {
    this.dialogRef.close();
  }

  deleteBadge(): void {
    if (this.utilsService.role === Role.TEACHER) {
      this.loadingService.show();
      this.badgeService.deleteBadge(this.data.name).subscribe(
        ((value: any) => {
          switch (value.count) {
            case 1:
              this.alertService.show(this.translateService.instant('BADGES.DELETED'));
              break;
            case 0:
              this.alertService.show(this.translateService.instant('BADGES.NOTDELETED'));
              break;
            default:
              break;
          }
        }));
      this.cancel();

    }
  }
}
