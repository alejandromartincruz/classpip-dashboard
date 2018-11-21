import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppConfig } from './app.config';
import { AuthGuard } from './shared/auth/auth.guard';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { GroupsComponent } from './pages/groups/groups';
import { PointsBadgesComponent } from './pages/pointsbadges/pointsbadges';
import { CollectionsComponent } from './pages/collections/collections';
import { QuestionnairesComponent } from './pages/questionnaires/questionnaires';
import { CollectionStudentComponent } from './pages/collectionStudent/collectionStudent';

import { CollectionComponent } from './pages/collection/collection';
import { CreateCardComponent } from './pages/createCard/createCard';

import { QuestionnaireComponent } from './pages/questionnaire/questionnaire';
import { QuestionnaireResultsComponent } from './pages/questionnaireResults/questionnaireResults';
import { QuestionnaireAwardsComponent } from './pages/questionnaireAwards/questionnaireAwards';

import { DeleteQuestionnaireComponent } from './pages/deleteQuestionnaire/deleteQuestionnaire';
import { CreateQuestionnaireComponent } from './pages/createQuestionnaire/createQuestionnaire';
import { CreateQuestionnaireBadgesAssignmentComponent} from './pages/createQuestionnaireBadgesAssignment/createQuestionnaireBadgesAssignment';
import { CreateQuestionnairePackCardsAssignmentComponent} from './pages/createQuestionnairePackCardsAssignment/createQuestionnairePackCardsAssignment';

import { CreateQuestionnairePointsAssignmentComponent} from './pages/createQuestionnairePointsAssignment/createQuestionnairePointsAssignment';
import { CreateQuestionnaireTest1Component } from './pages/createQuestionnaireTest1/createQuestionnaireTest1';
import { CreateQuestionnaireTest2Component } from './pages/createQuestionnaireTest2/createQuestionnaireTest2';
import { CreateQuestionnaireTextArea1Component } from './pages/createQuestionnaireTextArea1/createQuestionnaireTextArea1';
import { CreateQuestionnaireTextArea2Component } from './pages/createQuestionnaireTextArea2/createQuestionnaireTextArea2';
import { CreatePointComponent } from './pages/createPoint/createPoint';
import { DeletePointComponent } from './pages/deletePoint/deletePoint';
import { CreateBadgeComponent } from './pages/createBadge/createBadge';
import { DeleteBadgeComponent } from './pages/deleteBadge/deleteBadge';
import { DeleteCollectionComponent } from './pages/deleteCollection/deleteCollection';

import { CreateTeamsComponent } from './pages/create-teams/create-teams';
// Competitions
import { CompetitionsComponent} from './pages/competitions/competitions';
import { LeagueComponent } from './pages/competitions/league/league';
import { TennisComponent} from './pages/competitions/tennis/tennis';
import { DeleteCompetitionComponent } from './pages/competitions/delete-competition/delete-competition';
import { CreateLeagueCompetitionComponent } from './pages/competitions/create-league-competition/create-league-competition';
import { CreateTennisCompetitionComponent } from './pages/competitions/create-tennis-competition/create-tennis-competition';
import { TeamsComponent } from './pages/competitions/teams/teams';
import { ClassificationComponent } from './pages/competitions/league/classification/classification';
import { JourneysLeagueComponent } from './pages/competitions/league/journeys-league/journeys-league';
import { JourneysTennisComponent } from './pages/competitions/tennis/journeys-tennis/journeys-tennis';
import { TournamentsComponent } from './pages/competitions/tennis/tournaments/tournaments';


import { LanguageComponent } from './pages/language/language';
import { DeleteCardComponent } from './pages/deleteCard/deleteCard';
import { CreateCollectionComponent } from './pages/createCollection/createCollection';
import { GroupStudentsComponent } from './pages/groupStudents/groupStudents';

const appRoutes: Routes = [

  // authenticated pages
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: GroupsComponent, canActivate: [AuthGuard] },
  { path: 'create-teams', component: CreateTeamsComponent, canActivate: [AuthGuard]},
  { path: 'competitions', component: CompetitionsComponent, canActivate: [AuthGuard]},
  { path: 'competition/delete', component: DeleteCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/create', component: CreateTennisCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/create', component: CreateLeagueCompetitionComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id', component: LeagueComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/classification', component: ClassificationComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/journeys', component: JourneysLeagueComponent, canActivate: [AuthGuard]},
  { path: 'competition/league/:id/teams', component: TeamsComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/:id', component: TennisComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/:id/tournaments', component: TournamentsComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/:id/journeys', component: JourneysTennisComponent, canActivate: [AuthGuard]},
  { path: 'competition/tennis/:id/teams', component: TeamsComponent, canActivate: [AuthGuard]},

  { path: 'groupStudents/:id', component: GroupStudentsComponent, canActivate: [AuthGuard] },

  { path: 'pointsbadges', component: PointsBadgesComponent, canActivate: [AuthGuard] },
  { path: 'collections', component: CollectionsComponent, canActivate: [AuthGuard] },
  { path: 'collection/:id', component: CollectionComponent, canActivate: [AuthGuard] },
  { path: 'createCollection', component: CreateCollectionComponent, canActivate: [AuthGuard] },
  { path: 'deleteColection', component: DeleteCollectionComponent, canActivate: [AuthGuard] },
  { path: 'collectionStudent/:id', component: CollectionStudentComponent, canActivate: [AuthGuard] },


  { path: 'createCard', component: CreateCardComponent, canActivate: [AuthGuard] },
  { path: 'deleteCard', component: DeleteCardComponent, canActivate: [AuthGuard] },


  { path: 'questionnaires', component: QuestionnairesComponent, canActivate: [AuthGuard] },
  { path: 'questionnaireAwards', component: QuestionnaireAwardsComponent, canActivate: [AuthGuard]},
  { path: 'questionnaire/:id', component: QuestionnaireComponent, canActivate: [AuthGuard] },
  { path: 'questionnaireResults/:id', component: QuestionnaireResultsComponent, canActivate: [AuthGuard] },
  { path: 'deleteQuestionnaire', component: DeleteQuestionnaireComponent, canActivate: [AuthGuard] },
  { path: 'createQuestionnaire', component: CreateQuestionnaireComponent, canActivate: [AuthGuard] },
  { path: 'createQuestionnairePointsAssignment', component: CreateQuestionnairePointsAssignmentComponent, canActivate: [AuthGuard] },
  { path: 'createQuestionnaireBadgesAssignment', component: CreateQuestionnaireBadgesAssignmentComponent, canActivate: [AuthGuard] },
  { path: 'createQuestionnairePackCardsAssignment', component: CreateQuestionnairePackCardsAssignmentComponent, canActivate: [AuthGuard] },

  { path: 'createQuestionnaireTest1', component: CreateQuestionnaireTest1Component, canActivate: [AuthGuard] },
  { path: 'createQuestionnaireTest2', component: CreateQuestionnaireTest2Component, canActivate: [AuthGuard] },
  { path: 'createQuestionnaireTextArea1', component: CreateQuestionnaireTextArea1Component, canActivate: [AuthGuard] },
  { path: 'createQuestionnaireTextArea2', component: CreateQuestionnaireTextArea2Component, canActivate: [AuthGuard] },
  { path: 'createPoint', component: CreatePointComponent, canActivate: [AuthGuard] },

  { path: 'deletePoint', component: DeletePointComponent, canActivate: [AuthGuard] },
  { path: 'createBadge', component: CreateBadgeComponent, canActivate: [AuthGuard]},
  { path: 'deleteBadge', component: DeleteBadgeComponent, canActivate: [AuthGuard] },

  { path: 'language', component: LanguageComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },

  // unauthenticad pages
  { path: 'login', component: LoginComponent },

  // otherwise (redirect to home)
  { path: '**', redirectTo: '' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
