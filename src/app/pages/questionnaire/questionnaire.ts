import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { Login, Group, Role, Questionnaire, Question, Answer } from '../../shared/models/index';
import { AppConfig } from '../../app.config';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService, UtilsService, GroupService, AlertService, QuestionnaireService } from '../../shared/services/index';
import { DeleteQuestionnaireComponent } from '../../pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from '../../pages/createQuestionnaire/createQuestionnaire';


@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.html',
  styleUrls: ['./questionnaire.scss']
})
export class QuestionnaireComponent implements OnInit {

  public myQuestionnaire: Questionnaire;
  public myQuestions: Array<Question>;
  public myAnswers1: Array<Answer>;
  public myAnswers2: Array<Answer>;
  public myAnswers3: Array<Answer>;
  public myAnswers4: Array<Answer>;
  public snackbar: MatSnackBar;
  private returnUrl: string;
  public questionnaireId: string;
  // tslint:disable-next-line:no-any
  private sub: any;
  public items: string[] = [];


  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public alertService: AlertService,
    public utilsService: UtilsService,
    public loadingService: LoadingService,
    public questionnaireService: QuestionnaireService,
    public dialog: MatDialog) {

    this.utilsService.currentUser = Login.toObject(localStorage.getItem(AppConfig.LS_USER));
    this.utilsService.role = Number(localStorage.getItem(AppConfig.LS_ROLE));

  }

  public ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/questionnaireResults';

    this.sub = this.route.params.subscribe(params => {
      this.questionnaireId = params['id'];
    });

    if (this.utilsService.role === Role.TEACHER) {

      this.questionnaireService.getMyQuestionnaire(this.questionnaireId).subscribe(
        ((questionnaire: Questionnaire) => {
          this.myQuestionnaire = questionnaire;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));




      this.questionnaireService.getMyQuestionnaireQuestions(this.questionnaireId).subscribe(
        ((questions: Array<Question>) => {
          this.myQuestions = questions;
          this.loadingService.hide();
        }),
        ((error: Response) => {
          this.loadingService.hide();
          this.alertService.show(error.toString());
        }));
    }
  }

  public goToResultQuestionnaire(): void {

    this.router.navigate([this.returnUrl, this.questionnaireId]);
  }
}
