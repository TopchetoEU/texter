import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AllUsersComponent } from './all-users/all-users.component';
import { AllArticlesComponent } from './all-articles/all-articles.component';
import { UserComponent } from './user/user.component';
import { ArticleComponent } from './article/article.component';
import { LoginComponent } from './login/login.component';

import {
  IgxButtonModule,
  IgxRippleModule,
  IgxCardModule,
  IgxInputGroupModule,
  IgxDropDownModule,
  IgxToggleModule,
  IgxIconModule,
  IgxProgressBarModule,
  IgxAutocompleteModule
} from 'igniteui-angular';
import { HomeComponent } from './home/home.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { UserPipe } from './username.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AllUsersComponent,
    AllArticlesComponent,
    UserComponent,
    ArticleComponent,
    LoginComponent,
    HomeComponent,
    SearchPageComponent,
    UserPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,

    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,

    IgxButtonModule,
    IgxRippleModule,
    IgxCardModule,
    IgxInputGroupModule,
    IgxDropDownModule,
    IgxToggleModule,
    IgxIconModule,
    IgxProgressBarModule,
    IgxAutocompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
