import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Login, Role } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, AlertService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './language.html',
  styleUrls: ['./language.scss']
})
export class LanguageComponent implements OnInit {

  idioms = [];

  constructor(
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public dialog: MatDialog,
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<LanguageComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.idioms = [
      {
        value: 'ca',
        label: 'Català'
      },
      {
        value: 'es',
        label: 'Español'
      },
      {
        value: 'en',
        label: 'English'
      }
    ];

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

  }

  ngOnInit(): void {

    if (this.utilsService.role === Role.TEACHER) {

    }
  }

  public choose(lang: string): void {
    this.translateService.use(lang);
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
