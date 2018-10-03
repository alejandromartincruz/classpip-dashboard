import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { MesaComponent } from './pages/mesa/mesa';

// shared (components)
import { NavBarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';

// shared (services)
import { AuthGuard } from './shared/auth/auth.guard';
import { LoadingComponent } from './shared/loading/loading';
import {
  UtilsService, LoginService, LoadingService, AlertService,
  SchoolService, AvatarService, UserService, GroupService,
  GradeService, MatterService, MesaService
} from './shared/services/index';

// rxjs
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';

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
    MesaComponent,
    // shared
    NavBarComponent,
    FooterComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppMaterialModule,
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
    MesaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
