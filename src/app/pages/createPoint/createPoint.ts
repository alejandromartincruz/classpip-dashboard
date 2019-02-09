import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Point } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, PointService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { TranslateService } from 'ng2-translate';



@Component({
  /*selector: 'app-createQuestionnaire',*/
  templateUrl: './createPoint.html',
  styleUrls: ['./createPoint.scss']
})
export class CreatePointComponent implements OnInit {


  public name: string;
  public value: number;
  public image: string;
  public newPoint: Point;
  constructor(
    public translateService: TranslateService,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public pointService: PointService,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<CreatePointComponent>,



    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));
  }

  ngOnInit(): void {
  }
  cancel(): void {
    this.dialogRef.close();
  }
  createPoint(): void {

    if (this.name === '' || !this.value || this.image === '') {
      this.alertService.show(this.translateService.instant('ERROR.EMPTYFIELDS'));
    } else {

      this.pointService.savePoint(this.name, this.value, this.image).subscribe(
        ((newPoint: Point) => {
          this.newPoint = newPoint;
          this.alertService.show(this.translateService.instant('POINTS.CREATED'));
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));

      this.cancel();

    }
  }
}
