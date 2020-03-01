import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserPageComponent } from './user-page/user-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { ArticlesCreatePageComponent } from './articles-create-page/articles-create-page.component';
const routes = [
    { path: 'user/:id', component: UserPageComponent },
    { path: 'article/:id', component: ArticlePageComponent },
    { path: 'logIn', component: LoginPageComponent },
    { path: 'signin', component: SigninPageComponent },
    { path: 'post', component: ArticlesCreatePageComponent },
    { path: '', component: HomePageComponent }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map