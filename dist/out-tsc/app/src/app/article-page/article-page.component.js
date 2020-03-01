import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
let ArticlePageComponent = class ArticlePageComponent {
    constructor(router, db) {
        this.router = router;
        this.db = db;
    }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.articleId = this.router.snapshot.paramMap.get('id');
        });
    }
};
ArticlePageComponent = __decorate([
    Component({
        selector: 'app-article-page',
        templateUrl: './article-page.component.html',
        styleUrls: ['./article-page.component.scss']
    })
], ArticlePageComponent);
export { ArticlePageComponent };
//# sourceMappingURL=article-page.component.js.map