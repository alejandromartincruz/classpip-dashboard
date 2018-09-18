import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import { UtilsService } from './utils.service';
import { AppConfig } from '../../app.config';
import { Credentials } from '../models/credentials';
import { Role } from '../models/role';
import { Login } from '../models/login';
import { Question } from '../models/question';
import { Questionnaire } from '../models/questionnaire';
import { Answer } from '../models/answer';
import { Student } from '../models/student';
import { CorrectAnswer } from '../models/correctAnswer';
import { TranslateService } from 'ng2-translate/ng2-translate';
/*import { GetQuestionnairePage } from '../pages/getQuestionnaire/getQuestionnaire';*/
import { ResultQuestionnaire } from '../models/resultQuestionnaire';

@Injectable()
export class QuestionnaireService {

  constructor(
    public http: Http,
    public translateService: TranslateService,
    public utilsService: UtilsService) {

    }

  /**
   * This method returns all questionnaires of the logged
   * in user.
   * @return {Observable<Array<Questionnaire>} returns an observable array with the result
   * of the operation
   */
   public getMyQuestionnaire(id: string): Observable<Questionnaire> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string = AppConfig.QUESTIONNAIRE_URL + '/' + id;

    return this.http.get(url, options)
      .map((response: Response, index: number) => {
        let questionnaire: Questionnaire = Questionnaire.toObject(response.json())
        this.utilsService.currentQuestionnaire = questionnaire;
        return questionnaire;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  /**
   * This method returns all the information of the questionnaires
   * of the current teacher logged into the application
   * @return {Array<Questionnaire>} returns the list of questionnaires
   */
 /* public getMyQuestionnaires(): Observable<Array<Questionnaire>> {

    const ret: Array<Questionnaire> = new Array<Questionnaire>();

    return Observable.create(observer => {
      this.getQuestionnaires().subscribe(questionnaires => {
        questionnaires.forEach(group => {
          this.gradeService.getGrade(group.gradeId).subscribe(
            grade => {
              group.grade = grade;
              this.matterService.getMatter(group.matterId).subscribe(
                matter => {
                  group.matter = matter;
                  ret.push(group);
                  if (ret.length === groups.length) {
                    observer.next(ret);
                    observer.complete();
                  }
                }, error => observer.error(error));
            }, error => observer.error(error));
        });
      }, error => observer.error(error));
    });
  }

    /**
   * Returns the questionnaires with the one level information of the current
   * logged in user into the application
   * @return {Array<Questionnaire>} returns the list of questionnaires
   */
  public getQuestionnaires(): Observable<Array<Questionnaire>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = this.utilsService.getMyUrl() + AppConfig.QUESTIONNAIRES_URL;


    return this.http.get(url, options)
      .map((response: Response, index: number) => Questionnaire.toObjectArray(response.json()));
  }

    /**
   * Returns the questionnaires with the one level information of the current
   * logged in user into the application
   * @return {Array<Questionnaire>} returns the list of questionnaires
   */
  public getAllQuestionnaires(): Observable<Array<Questionnaire>> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.QUESTIONNAIRE_URL;


    return this.http.get(url, options)
      .map((response: Response, index: number) => Questionnaire.toObjectArray(response.json()));
  }

    /**
   * Returns a matter object with all the information from a matter
   * identifier. This method is used to fill all the information
   * of the groups we are querying
   * @return {Matter} matter object with all the information
   */
  public deleteQuestionnaire(idQuestionnaire: number): Observable<any> {

    const options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    const url: string = AppConfig.QUESTIONNAIRE_URL + '/' + idQuestionnaire;

    return this.http.delete(url, options)
        .map(response => {

          return response.json()})
        .catch(this.handleError);
  }

  private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }

  private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
    public updateQuestionnaire(id: string, name: string, date: string, groupid: string, points: number[], active: boolean, badges: string[] ): Observable<Questionnaire> {

      let options: RequestOptions = new RequestOptions({
        headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
      });

      let url: string;
      url = AppConfig.QUESTIONNAIRE_URL;
      let postParams;

          postParams = {
            id: id,
            name: name,
            date: date,
            groupid:groupid,
            points: points,
            badges:badges,
            active: active,

      }




      return this.http.patch(url, postParams, options)
        .map(response => {
          this.utilsService.currentQuestionnaire = Questionnaire.toObject(response.json());
          return this.utilsService.currentQuestionnaire;
        })
        .catch((error: Response) => this.utilsService.handleAPIError(error));

    }

  public saveQuestionnaire(stringData: Array<string>): Observable<Questionnaire> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    let url: string;
    url = AppConfig.QUESTIONNAIRE_URL;
    let postParams;

    {
       postParams = {
        name: stringData[0],
        date: stringData[1],
        groupid: stringData[2],
        points: stringData[3],
        badges: stringData[4],
        active:true,
        packCards: stringData[5],
        teacherId: this.utilsService.currentUser.userId,
      }
    }
    return this.http.post(url, postParams, options)
      .map(response => {
        this.utilsService.currentQuestionnaire = Questionnaire.toObject(response.json());
        return Questionnaire;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));

  }

  public saveQuestionAnswersCorrectAnswer(numberData: Array<number>, questionData: Array<string>): Observable<Array<Question>> {

    let ret: Array<Question> = new Array<Question>();

    return Observable.create(observer => {
      this.postQuestionnaireQuestions(numberData, questionData).subscribe(
        question => {
            this.postQuestionAnswers(questionData[1]).subscribe(
              answer1 => {
                question.answer = answer1;
                  this.postQuestionAnswers(questionData[2]).subscribe(
                    answer2 => {
                      question.answer = answer2;
                        this.postQuestionAnswers(questionData[3]).subscribe(
                          answer3 => {
                            question.answer = answer3;
                              this.postQuestionAnswers(questionData[4]).subscribe(
                                answer4 => {
                                  question.answer = answer4;
                                    this.postQuestionCorrectAnswers(questionData).subscribe(
                                      correctAnswer => {
                                        question.correctAnswer = correctAnswer;
                                        ret.push(question);
                                        if (ret.length === 1) {
                                          observer.next(ret);
                                          observer.complete();
                                        }
                                      }, error => observer.error(error));
                                    }, error => observer.error(error));
                                  }, error => observer.error(error));
                                }, error => observer.error(error));
                              }, error => observer.error(error));
                            }, error => observer.error(error)
                          );
    });
  }

  public postQuestionnaireQuestions(numberData: Array<number>, questionData: Array<string>): Observable<Question> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    let url: string;
    url = AppConfig.QUESTIONNAIRE_URL + '/' + this.utilsService.currentQuestionnaire.id + AppConfig.QUESTIONS_URL;

    let timeQuestion: number;
    timeQuestion = numberData[0] / numberData[1];

    let postParams = {
      name: questionData[0],
      type: questionData[6],
      image: questionData[7],
      time: timeQuestion,
      questionnaireId: this.utilsService.currentQuestionnaire.id
    }

    return this.http.post(url, postParams, options)
      .map(response => {
        this.utilsService.currentQuestion = Question.toObject(response.json());
        return Question;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

   public postQuestionAnswers(answer: string): Observable<Array<Answer>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    let url: string;
    url = AppConfig.QUESTION_URL + '/' + this.utilsService.currentQuestion.id + AppConfig.ANSWERS_URL;

    let postParams = {
      name: answer,
      questionId: this.utilsService.currentQuestion.id
    }

    return this.http.post(url, postParams, options)
      .map(response => {
        this.utilsService.currentAnswer = Answer.toObject(response.json());
        return Answer;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }

  public postQuestionCorrectAnswers(questionData: Array<string>): Observable<Array<CorrectAnswer>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    let url: string;
    url = AppConfig.QUESTION_URL + '/' + this.utilsService.currentQuestion.id + AppConfig.CORRECTANSWERS_URL;

    let postParams = {
      name: questionData[5],
      questionId: this.utilsService.currentQuestion.id
    }

    return this.http.post(url, postParams, options)
      .map(response => {
        this.utilsService.currentCorrectAnswer = CorrectAnswer.toObject(response.json());
        return CorrectAnswer;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }


  /**
   * Returns the list of questions by a questionnaire id.
   * @return Observable{Array<Question>} returns the list of questions
   * that include the four possible answers and the correct answer
   */
  public getMyQuestionnaireQuestions(idQuestionnaire: string): Observable<Array<Question>> {

    var ret: Array<Question> = new Array<Question>();

    return Observable.create(observer => {
      this.getQuestionnaireQuestions(idQuestionnaire).subscribe(
        questions => {
          questions.forEach(question => {
            this.getQuestionAnswers(question.id).subscribe(
              answers => {
                question.answer = answers;
                  this.getQuestionCorrectAnswers(question.id).subscribe(
                    correctAnswer => {
                      question.correctAnswer = correctAnswer;
                      ret.push(question);
                      if (ret.length === questions.length) {
                        observer.next(ret);
                        observer.complete();
                      }
                    }, error => observer.error(error));
              }, error => observer.error(error));
          });
        }, error => observer.error(error)
      );
    });
  }

  /**
   * Returns the list of questions by a questionnaire id.
   * @return Observable{Array<Question>} returns the list of questions
   */
  private getQuestionnaireQuestions(idQuestionnaire: string): Observable<Array<Question>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.QUESTIONNAIRE_URL + '/' + idQuestionnaire + AppConfig.QUESTIONS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) =>  Question.toObjectArray(response.json()));
  }

  /**
   * Returns the list of answers by a questionnaire id.
   * @return Observable{Array<Answer>} returns the list of answers
   */
  public getQuestionAnswers(id: string): Observable<Array<Answer>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.QUESTION_URL + '/' + id + AppConfig.ANSWERS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) =>  Answer.toObjectArray(response.json()));
  }

  /**
   * Returns the list of correct answers by a questionnaire id.
   * @return Observable{Array<CorrectAnswer>} returns the list of correct answers
   */
  public getQuestionCorrectAnswers(id: string): Observable<Array<CorrectAnswer>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.QUESTION_URL + '/' + id + AppConfig.CORRECTANSWERS_URL;

    return this.http.get(url, options)
      .map((response: Response, index: number) =>  CorrectAnswer.toObjectArray(response.json()));
  }

  public getResultsQuestionnaire(idQuestionnaire: string): Observable<Array<ResultQuestionnaire>> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var count: number = 0;
    var url: string = AppConfig.RESULTQUESTIONNAIRE_URL + '?filter[where][questionnaireId]=' + idQuestionnaire;

    return this.http.get(url, options)
      .map((response: Response, index: number) =>  ResultQuestionnaire.toObjectArray(response.json()));
  }

  /**
  * Method that saves the results of the questionnaire
  */
 /* public saveResults(questionnaireName: string, questionnaireId: string, numTotalQuestions: number, numAnswerCorrect: number, numAnswerNoCorrect: number, finalNote: number, dataAnswers: Array<string>): Observable<ResultQuestionnaire> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string;
    switch (this.utilsService.role) {
      case Role.STUDENT:
        url = AppConfig.RESULTQUESTIONNAIRE_URL;
        break;
      case Role.TEACHER:
        url = AppConfig.RESULTSQUESTIONNAIRE_URL;
        break;
      case Role.SCHOOLADMIN:
        url = AppConfig.RESULTSQUESTIONNAIRE_URL;
        break;
      default:
        break;
    }

    let postParams = {
      questionnaireName: questionnaireName,
      questionnaireId: questionnaireId,
      numTotalQuestions: numTotalQuestions,
      numAnswerCorrect: numAnswerCorrect,
      numAnswerNoCorrect: numAnswerNoCorrect,
      finalNote: finalNote,
      studentId: this.utilsService.currentUser.userId,
      dataAnswers: dataAnswers
    }

    return this.http.post(url, postParams, options)
      .map((response: Response, index: number) => ResultQuestionnaire.toObject(response.json()))

  }

  /**
   * Returns the student by a id.
   * @return {Stuent} returns the student
   */
 /* public getMyResultsStudent(id: number): Observable<Student> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    //var count: number = 0;
    var url: string = AppConfig.STUDENT_URL + '/' + id;

    return this.http.get(url, options)
      .map((response: Response, index: number) => Student.toObject(response.json()))

  }

  /**
   * Returns the list of questions by a questionnaire id.
   * @return Observable{Array<Question>} returns the list of questions
   * that include the four possible answers and the correct answer
   */
 /* public getQuestionsAnswersCorrectAnswers(credentials: Credentials): Observable<Array<Question>> {

    var ret: Array<Question> = new Array<Question>();

    return Observable.create(observer => {
      this.getQuestionnaireQuestions(credentials).subscribe(
        questions => {
          questions.forEach(question => {
            this.getQuestionAnswers(question.id).subscribe(
              answers => {
                question.answer = answers;
                  this.getQuestionCorrectAnswers(question.id).subscribe(
                    correctAnswer => {
                      question.correctAnswer = correctAnswer;
                      ret.push(question);
                      if (ret.length === questions.length) {
                        observer.next(ret);
                        observer.complete();
                      }
                    }, error => observer.error(error))
              }, error => observer.error(error))
          });
        }, error => observer.error(error)
      )
    });
  }


  /**
   * This method executes a logout into the application, removes
   * the current logged user
   * @return {Observable<Boolean>} returns an observable with the result
   * of the operation
   */
 /** public logout(): Observable<Response> {

    let options: RequestOptions = new RequestOptions({
      headers: this.utilsService.setAuthorizationHeader(new Headers(), this.utilsService.currentUser.id)
    });

    var url: string;
    switch (this.utilsService.role) {
      case Role.STUDENT:
        url = AppConfig.STUDENT_URL + AppConfig.LOGOUT_URL;
        break;
      case Role.TEACHER:
        url = AppConfig.TEACHER_URL + AppConfig.LOGOUT_URL;
        break;
      case Role.SCHOOLADMIN:
        url = AppConfig.SCHOOLADMIN_URL + AppConfig.LOGOUT_URL;
        break;
      default:
        break;
    }

    return this.http.post(url, {}, options)
      .map(response => {
        this.utilsService.currentUser = null;
        return true;
      })
      .catch((error: Response) => this.utilsService.handleAPIError(error));
  }*/

}
