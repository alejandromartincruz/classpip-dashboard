import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { LoadingComponent } from './shared/loading/loading';
import { routing } from './app.routing';
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { GroupsComponent } from './pages/groups/groups';
import { PointsBadgesComponent } from './pages/pointsbadges/pointsbadges';
import { CollectionsComponent } from './pages/collections/collections';
import { CollectionComponent } from './pages/collection/collection';
import { CreateCardComponent } from './pages/createCard/createCard';
import { CompetitionsComponent } from './pages/competitions/competitions';
import { CreateTeamsComponent } from './pages/create-teams/create-teams';
import { LeagueComponent} from './pages/competitions/league/league';
import { TennisComponent} from './pages/competitions/tennis/tennis';
import { CreateLeagueCompetitionComponent } from './pages/competitions/create-league-competition/create-league-competition';
import { CreateTennisCompetitionComponent } from './pages/competitions/create-tennis-competition/create-tennis-competition';
import { DeleteCompetitionComponent } from './pages/competitions/delete-competition/delete-competition';
import { TeamsComponent } from './pages/competitions/teams/teams';
import { ClassificationComponent } from './pages/competitions/league/classification/classification';
import { JourneysLeagueComponent } from './pages/competitions/league/journeys-league/journeys-league';
import { JourneysTennisComponent } from './pages/competitions/tennis/journeys-tennis/journeys-tennis';
import { TournamentsComponent } from './pages/competitions/tennis/tournaments/tournaments';

import { QuestionnairesComponent } from './pages/questionnaires/questionnaires';
import { QuestionnaireAwardsComponent } from './pages/questionnaireAwards/questionnaireAwards';

import { QuestionnaireComponent } from './pages/questionnaire/questionnaire';
import { QuestionnaireResultsComponent } from './pages/questionnaireResults/questionnaireResults';
import { DeleteQuestionnaireComponent } from './pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from './pages/createQuestionnaire/createQuestionnaire';
import { CreateQuestionnairePointsAssignmentComponent } from './pages/createQuestionnairePointsAssignment/createQuestionnairePointsAssignment';
import { CreateQuestionnaireBadgesAssignmentComponent} from './pages/createQuestionnaireBadgesAssignment/createQuestionnaireBadgesAssignment';
import { CreateQuestionnairePackCardsAssignmentComponent} from './pages/createQuestionnairePackCardsAssignment/createQuestionnairePackCardsAssignment';

import { CreateQuestionnaireTest1Component } from './pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTest2Component } from './pages/createQuestionnaireTest2/createQuestionnaireTest2';
import { CreateQuestionnaireTextArea1Component } from './pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { CreateQuestionnaireTextArea2Component } from './pages/createQuestionnaireTextArea2/createQuestionnaireTextArea2';
import { CreatePointComponent } from './pages/createPoint/createPoint';
import { DeletePointComponent } from './pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from './pages/createBadge/createBadge';
import { DeleteBadgeComponent } from './pages/deleteBadge/deleteBadge';

// pipes
import { OrderByIdPipe } from './shared/pipes/order-by-id.pipe';
import { OrderByNamePipe } from './shared/pipes/order-by-name.pipe';
import { OrderBySurnamePipe } from './shared/pipes/order-by-surname.pipe';


import { LanguageComponent } from './pages/language/language';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppMaterialModule } from './app.material.module';
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from 'ng2-translate';
import { AppConfig } from './app.config';
import { NgxLoremIpsumModule } from 'ngx-lorem-ipsum';
import { APP_BASE_HREF } from '@angular/common';
import { AuthGuard } from './shared/auth/auth.guard';
import {
  AvatarService, AlertService, LoadingService, SchoolService, LoginService,
  UserService, GradeService, GroupService, UtilsService,
  MatterService, QuestionnaireService, PointService,
   PointRelationService, BadgeService, BadgeRelationService, CollectionService,
  CompetitionService, JourneyService, MatchesService, TeamService
} from './shared/services/index';
import { DeleteCardComponent } from './pages/deleteCard/deleteCard';
import { CreateCollectionComponent } from './pages/createCollection/createCollection';
import { DeleteCollectionComponent } from './pages/deleteCollection/deleteCollection';
import { CollectionStudentComponent } from './pages/collectionStudent/collectionStudent';
import { GroupStudentsComponent } from './pages/groupStudents/groupStudents';


export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, AppConfig.LANG_PATH, AppConfig.LANG_EXT);
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        // pages
        CreateQuestionnairePointsAssignmentComponent,
        CreateQuestionnaireBadgesAssignmentComponent,
        CreateQuestionnairePackCardsAssignmentComponent,
        PointsBadgesComponent,
        LoginComponent,
        HomeComponent,
        GroupsComponent,
        GroupStudentsComponent,
        CollectionsComponent,
        CollectionComponent,
        CollectionStudentComponent,
        CreateCollectionComponent,
        DeleteCollectionComponent,
        CreateCardComponent,
	CompetitionsComponent,
        CreateTeamsComponent,
        // pages (competitions)
        LeagueComponent,
        TennisComponent,
        CreateLeagueCompetitionComponent,
        CreateTennisCompetitionComponent,
        DeleteCompetitionComponent,
        TeamsComponent,
        ClassificationComponent,
        JourneysLeagueComponent,
        JourneysTennisComponent,
        TournamentsComponent,
        DeleteCardComponent,
        QuestionnairesComponent,
        QuestionnaireComponent,
        QuestionnaireResultsComponent,
        QuestionnaireAwardsComponent,
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
        OrderBySurnamePipe
      ],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        routing,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [Http]
        }),
        NgxLoremIpsumModule
      ], providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
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
        BadgeRelationService
	CompetitionService,
        JourneyService,
        MatchesService,
        TeamService,
        DatePipe
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it('should render header in a app-navbar tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-navbar').textContent).toContain('');
  }));
});
