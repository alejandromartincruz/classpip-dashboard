import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { NgxLoremIpsumModule } from 'ngx-lorem-ipsum';

// aplication
import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { AppMaterialModule } from './app.material.module';
import { routing } from './app.routing';

// pages
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GroupsComponent } from './pages/groups/groups';
import { PointsBadgesComponent } from './pages/pointsbadges/pointsbadges';
import { CollectionsComponent } from './pages/collections/collections';
import { CollectionComponent } from './pages/collection/collection';
import { CollectionStudentComponent } from './pages/collectionStudent/collectionStudent';

import { CreateCardComponent } from './pages/createCard/createCard';

import { QuestionnairesComponent } from './pages/questionnaires/questionnaires';
import { QuestionnaireComponent } from './pages/questionnaire/questionnaire';
import { QuestionnaireResultsComponent } from './pages/questionnaireResults/questionnaireResults';
import { DeleteQuestionnaireComponent } from './pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from './pages/createQuestionnaire/createQuestionnaire';
import {
  CreateQuestionnairePointsAssignmentComponent
} from './pages/createQuestionnairePointsAssignment/createQuestionnairePointsAssignment';
import {
  CreateQuestionnaireBadgesAssignmentComponent
} from './pages/createQuestionnaireBadgesAssignment/createQuestionnaireBadgesAssignment';
import {
  CreateQuestionnairePackCardsAssignmentComponent
} from './pages/createQuestionnairePackCardsAssignment/createQuestionnairePackCardsAssignment';

import { CreateQuestionnaireTest1Component } from './pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTest2Component } from './pages/createQuestionnaireTest2/createQuestionnaireTest2';
import { CreateQuestionnaireTextArea1Component } from './pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { CreateQuestionnaireTextArea2Component } from './pages/createQuestionnaireTextArea2/createQuestionnaireTextArea2';

import { CreatePointComponent } from './pages/createPoint/createPoint';
import { DeletePointComponent } from './pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from './pages/createBadge/createBadge';
import { DeleteBadgeComponent } from './pages/deleteBadge/deleteBadge';

import { LanguageComponent } from './pages/language/language';

// shared (components)
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
// pipes
import { OrderByIdPipe } from './shared/pipes/order-by-id.pipe';
import { OrderByNamePipe } from './shared/pipes/order-by-name.pipe';
import { OrderBySurnamePipe } from './shared/pipes/order-by-surname.pipe';

// shared (services)
import { AuthGuard } from './shared/auth/auth.guard';
import { LoadingComponent } from './shared/loading/loading';
import {
  UtilsService, LoginService, LoadingService, AlertService,
  SchoolService, AvatarService, UserService, GroupService,
  GradeService, MatterService, QuestionnaireService,
  CollectionService, PointService, PointRelationService,
  BadgeService, BadgeRelationService, LevelService,
  RewardService
} from './shared/services/index';

// rxjs
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { DeleteCardComponent } from './pages/deleteCard/deleteCard';
import { CreateCollectionComponent } from './pages/createCollection/createCollection';
import { DeleteCollectionComponent } from './pages/deleteCollection/deleteCollection';
import { QuestionnaireAwardsComponent } from './pages/questionnaireAwards/questionnaireAwards';
import { GroupStudentsComponent } from './pages/groupStudents/groupStudents';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { SchoolComponent } from './pages/school/school.component';
import { TeacherHomeComponent } from './pages/teacher-home/teacher-home.component';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

@NgModule({
  declarations: [
    AppComponent,
    // pages
    LoginComponent,
    HomeComponent,
    GroupsComponent,
    GroupStudentsComponent,
    PointsBadgesComponent,
    CollectionsComponent,
    CollectionComponent,
    CollectionStudentComponent,
    CreateCardComponent,
    DeleteCardComponent,
    CreateCollectionComponent,
    DeleteCollectionComponent,

    CreateQuestionnairePointsAssignmentComponent,
    CreateQuestionnaireBadgesAssignmentComponent,
    CreateQuestionnairePackCardsAssignmentComponent,
    QuestionnairesComponent,
    QuestionnaireComponent,
    QuestionnaireAwardsComponent,
    QuestionnaireResultsComponent,
    DeleteQuestionnaireComponent,
    CreateQuestionnaireComponent,
    CreatePointComponent,
    DeletePointComponent,
    CreateBadgeComponent,
    DeleteBadgeComponent,
    CreateQuestionnaireTest1Component,
    CreateQuestionnaireTest2Component,
    CreateQuestionnaireTextArea1Component,
    CreateQuestionnaireTextArea2Component,
    LanguageComponent,
    // shared
    NavBarComponent,
    FooterComponent,
    LoadingComponent,
    OrderByIdPipe,
    OrderByNamePipe,
    OrderBySurnamePipe,
    StudentHomeComponent,
    SchoolComponent,
    TeacherHomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    routing,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: createTranslateLoader,
      deps: [Http]
    }),
    NgxLoremIpsumModule
  ],
  providers: [
    AuthGuard,
    AvatarService,
    AlertService,
    LoginService,
    LoadingService,
    SchoolService,
    UserService,
    UtilsService,
    GroupService,
    GradeService,
    MatterService,
    QuestionnaireService,
    PointService,
    PointRelationService,
    BadgeService,
    BadgeRelationService,
    CollectionService,
    LevelService,
    RewardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
