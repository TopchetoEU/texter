import { __decorate } from "tslib";
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserPageComponent } from './user-page/user-page.component';
import { ArticlePageComponent } from './article-page/article-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { IgxButtonModule, IgxRippleModule, IgxCardModule, IgxInputGroupModule, IgxDropDownModule, IgxToggleModule, IgxIconModule, IgxProgressBarModule, IgxAutocompleteModule } from 'igniteui-angular';
import { SigninPageComponent } from './signin-page/signin-page.component';
import { ArticleComponent } from './article/article.component';
import { ArticlesCreatePageComponent } from './articles-create-page/articles-create-page.component';
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            UserPageComponent,
            ArticlePageComponent,
            LoginPageComponent,
            HomePageComponent,
            SigninPageComponent,
            ArticleComponent,
            ArticlesCreatePageComponent
        ],
        imports: [
            BrowserModule,
            HttpClientModule,
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
            HammerModule
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map