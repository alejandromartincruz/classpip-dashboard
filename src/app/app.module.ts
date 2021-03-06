import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { MatInputModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';
import { NgxLoremIpsumModule } from 'ngx-lorem-ipsum';
import { DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';

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

import { CompetitionsComponent } from './pages/competitions/competitions';
import { CreateTeamsComponent } from './pages/create-teams/create-teams';
// pages (competitions)
import { LeagueComponent } from './pages/competitions/league/league';
import { TennisComponent } from './pages/competitions/tennis/tennis';
import { CreateLeagueCompetitionComponent } from './pages/competitions/create-league-competition/create-league-competition';
import { CreateTennisCompetitionComponent } from './pages/competitions/create-tennis-competition/create-tennis-competition';
import { DeleteCompetitionComponent } from './pages/competitions/delete-competition/delete-competition';
import { TeamsComponent } from './pages/competitions/teams/teams';
import { ClassificationComponent } from './pages/competitions/league/classification/classification';
import { AutomationComponent } from './pages/competitions/league/automation/automation';
import { JourneysLeagueComponent } from './pages/competitions/league/journeys-league/journeys-league';
import { JourneysTennisComponent } from './pages/competitions/tennis/journeys-tennis/journeys-tennis';
import { TournamentsComponent } from './pages/competitions/tennis/tournaments/tournaments';

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

import { ViewCardComponent } from './pages/viewcard/viewcard';
import { CreateQuestionnaireTest1Component } from './pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTest2Component } from './pages/createQuestionnaireTest2/createQuestionnaireTest2';
import { CreateQuestionnaireTextArea1Component } from './pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { CreateQuestionnaireTextArea2Component } from './pages/createQuestionnaireTextArea2/createQuestionnaireTextArea2';

import { CreatePointComponent } from './pages/createPoint/createPoint';
import { DeletePointComponent } from './pages/deletePoint/deletePoint';
import { ViewPointsComponent } from './pages/viewpoints/viewpoints';
import { ViewBadgesComponent } from './pages/viewbadges/viewbadges';
import { CreateBadgeComponent } from './pages/createBadge/createBadge';
import { DeleteBadgeComponent } from './pages/deleteBadge/deleteBadge';

import { AssistanceComponent } from './pages/assistance/assistance';

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
  RewardService, CompetitionService, JourneyService,
  MatchesService, TeamService, TeacherService
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
import { from } from 'rxjs/observable/from';
import { StudentHomeComponent } from './pages/student-home/student-home.component';
import { SchoolComponent } from './pages/school/school.component';
import { TeacherHomeComponent } from './pages/teacher-home/teacher-home.component';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { SchoolFormComponent } from './pages/forms/school-form/school-form.component';
import { MatPaginatorModule, MatDialogModule, MatFormFieldModule } from '@angular/material';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';
import { SchoolDetailsComponent } from './pages/school-details/school-details.component';
import { TeacherFormComponent } from './pages/forms/teacher-form/teacher-form.component';
import { GradeFormComponent } from './pages/forms/grade-form/grade-form.component';
import { MatterFormComponent } from './pages/forms/matter-form/matter-form.component';
import { RankFormComponent } from './pages/forms/rank-form/rank-form.component';
import { StudentFormComponent } from './pages/forms/student-form/student-form.component';
import { StudentService } from './shared/services/student.service';
import { GradeMatterRelComponent } from './pages/forms/grade-matter-rel/grade-matter-rel.component';
import { GroupsFormComponent } from './pages/forms/groups-form/groups-form.component';
import { GroupStudentsFormComponent } from './pages/forms/group-students-form/group-students-form.component';


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
    ViewCardComponent,
    CreateQuestionnaireTextArea1Component,
    CreateQuestionnaireTextArea2Component,
    ViewCardComponent,
    ViewPointsComponent,
    LanguageComponent,
    ViewBadgesComponent,
    ViewPointsComponent,
    CompetitionsComponent,
    CreateTeamsComponent,
    AssistanceComponent,
    LeagueComponent,
    TennisComponent,
    CreateLeagueCompetitionComponent,
    CreateTennisCompetitionComponent,
    DeleteCompetitionComponent,
    TeamsComponent,
    ClassificationComponent,
    AutomationComponent,
    JourneysLeagueComponent,
    JourneysTennisComponent,
    TournamentsComponent,

    // shared
    NavBarComponent,
    FooterComponent,
    LoadingComponent,
    OrderByIdPipe,
    OrderByNamePipe,
    OrderBySurnamePipe,
    StudentHomeComponent,
    SchoolComponent,
    TeacherHomeComponent,
    AdminHomeComponent,
    SchoolFormComponent,
    ConfirmationDialogComponent,
    SchoolDetailsComponent,
    TeacherFormComponent,
    GradeFormComponent,
    MatterFormComponent,
    RankFormComponent,
    StudentFormComponent,
    GradeMatterRelComponent,
    GroupsFormComponent,
    GroupStudentsFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    CdkTableModule,
    MatInputModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTableModule,
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
    CompetitionService,
    JourneyService,
    MatchesService,
    TeamService,
    DatePipe,
    LevelService,
    RewardService,
    TeacherService,
    StudentService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule { }
