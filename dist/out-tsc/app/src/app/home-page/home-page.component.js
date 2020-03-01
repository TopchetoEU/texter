import { __decorate } from "tslib";
import { Component } from '@angular/core';
let HomePageComponent = class HomePageComponent {
    constructor(db, globals, notifs) {
        this.db = db;
        this.globals = globals;
        this.notifs = notifs;
        this.articles = [];
        this.index = 0;
        this.articlesEnded = false;
    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.intervalId = setInterval(() => {
            this.loadNewContent();
        }, 1000);
    }
    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
    loadNewContent() {
        if (!this.articlesEnded && this.contentLoadRequired()) {
            this.db.getArticlesBySelector({}, {
                DoPaging: true,
                Paging: {
                    PageSize: 20,
                    PageCount: this.index,
                }
            }).subscribe(articles => {
                console.log(this.articles);
                if (articles.length > 0) {
                    articles.forEach(v => {
                        this.articles.push(v);
                    });
                    this.index++;
                }
                else {
                    this.articlesEnded = true;
                }
            });
        }
    }
    contentLoadRequired() {
        const windowHeight = window.innerHeight;
        const bodyHeight = document.body.getBoundingClientRect().height;
        const scroll = window.scrollY;
        return scroll > bodyHeight - 2 * windowHeight;
    }
};
HomePageComponent = __decorate([
    Component({
        selector: 'app-home',
        templateUrl: './home-page.component.html',
        styleUrls: ['./home-page.component.scss']
    })
], HomePageComponent);
export { HomePageComponent };
//# sourceMappingURL=home-page.component.js.map