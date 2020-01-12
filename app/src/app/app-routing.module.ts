import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPageComponent } from './user-page/user-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';

const routes: Routes = [
  { path: 'user/:id', component: UserPageComponent },
  { path: 'article/:id', component: ArticlePageComponent },
  { path: 'logIn', component: LoginPageComponent },
  { path: 'signin', component: SigninPageComponent },
  { path: '', component: HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
