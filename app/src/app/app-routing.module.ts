import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllUsersComponent } from "./all-users/all-users.component";
import { AllArticlesComponent } from './all-articles/all-articles.component';
import { UserComponent } from './user/user.component';
import { ArticleComponent } from './article/article.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SearchPageComponent } from './search-page/search-page.component';

const routes: Routes = [
  { path: 'allUsers', component: AllUsersComponent },
  { path: 'allArticles', component: AllArticlesComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'logIn', component: LoginComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
