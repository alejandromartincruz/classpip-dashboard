import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Login, Group, Role, Questionnaire, Question } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { CreateQuestionnaireTest1Component } from '../../pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTextArea1Component } from '../../pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
// tslint:disable-next-line:max-line-length
import { CreateQuestionnaireBadgesAssignmentComponent } from '../../pages/createQuestionnaireBadgesAssignment/createQuestionnaireBadgesAssignment';

@Component({
  /*selector: 'app-createQuestionnaireTest1',*/
  templateUrl: './createQuestionnairePointsAssignment.html',
  styleUrls: ['./createQuestionnairePointsAssignment.scss']
})
export class CreateQuestionnairePointsAssignmentComponent implements OnInit {
  myControl: FormControl = new FormControl();
  assigned = 0;

  public options = [];
  public questionnaires: Array<Questionnaire>;
  public myQuestionnaire: Questionnaire;
  public myQuestions: Array<Question>;
  public stringData = [];
  public numberData = [];
  public questionData = [];
  public numberQuestions: number;
  public num: number;
  public result: string;

  public points = [];
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public e: number;
  public f: number;
  public g: number;

  // tslint:disable-next-line:no-any
  device: any = [];
  public ind: number;
  public selectedType: string;
  constructor(
    public snackbar: MatSnackBar,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<CreateQuestionnairePointsAssignmentComponent>,
    // tslint:disable-next-line:no-any
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

    this.selectedType = data.stringSelected;

    for (let i = 0; i < data.stringData.length; i++) {
      this.stringData.push(data.stringData[i]);

    }
    for (let i = 0; i < data.numberData.length; i++) {
      this.numberData.push(data.numberData[i]);

    }

    this.num = data.num;
    for (this.ind = 0; this.ind <= 100; this.ind++) {
      this.options.push(this.ind);

    }


  }

  onChange(value) {
    if (value.checked === true) {
      this.assigned = 1;
    } else {
      this.assigned = 0;
    }
  }

  ngOnInit(): void {

    this.loadingService.show();
    this.questionnaireService.getQuestionnaires().subscribe(
      ((questionnaires: Array<Questionnaire>) => {
        this.questionnaires = questionnaires;
        this.loadingService.hide();
      }),
      ((error: Response) => {
        this.loadingService.hide();
        this.alertService.show(error.toString());
      }));

  }
  createQuestionnaire(): void {

    if (this.assigned === 1) {

      this.a == null ? this.points.push(0) : this.points.push(this.a);
      this.b == null ? this.points.push(0) : this.points.push(this.b);
      this.c == null ? this.points.push(0) : this.points.push(this.c);
      this.d == null ? this.points.push(0) : this.points.push(this.d);
      this.e == null ? this.points.push(0) : this.points.push(this.e);
      this.f == null ? this.points.push(0) : this.points.push(this.f);
      this.g == null ? this.points.push(0) : this.points.push(this.g);


      this.stringData.push(this.points);
    } else if (this.assigned === 0) {
      this.points.push(0);
      this.points.push(0);
      this.points.push(0);
      this.points.push(0);
      this.points.push(0);
      this.points.push(0);
      this.points.push(0);
      this.stringData.push(this.points);
    }

    const dialogRef1 = this.dialog.open(CreateQuestionnaireBadgesAssignmentComponent, {
      height: '600px',
      width: '700px',
      data: { stringSelected: this.selectedType, stringData: this.stringData, numberData: this.numberData, num: this.num }
    });

    dialogRef1.afterClosed().subscribe(result => {
      this.result = result;
      this.ngOnInit();
    });
    this.cancel();

  }

  cancel(): void {
    this.dialogRef.close();
  }
}
