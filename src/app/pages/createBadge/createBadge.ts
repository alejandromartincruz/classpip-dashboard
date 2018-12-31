import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Badge } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, BadgeService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createBadge.html',
  styleUrls: ['./createBadge.scss']
})
export class CreateBadgeComponent implements OnInit {


  public name: string;
  public value: number;
  public image: string;
  public newBadge: Badge;
  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public badgeService: BadgeService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateBadgeComponent>,



    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
  }
  cancel(): void {
    this.dialogRef.close();
  }
  createBadge(): void {

    if (this.name === '' || !this.value || this.image === '') {
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
    } else {

      this.badgeService.saveBadge(this.name, this.value, this.image).subscribe(
        ((newBadge: Badge) => {
          this.newBadge = newBadge;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      this.alertService.show(this.translateService.instant('BADGES.CREATED'));
      this.cancel();

    }
  }
}
