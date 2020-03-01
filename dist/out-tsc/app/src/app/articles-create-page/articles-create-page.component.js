import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Notification, NotificationType } from '../notifications.service';
let ArticlesCreatePageComponent = class ArticlesCreatePageComponent {
    constructor(db, gl, nots, router) {
        this.db = db;
        this.gl = gl;
        this.nots = nots;
        this.router = router;
    }
    ngOnInit() {
    }
    submit(title, content) {
        if (this.gl.loggedIn) {
            this.db.createArticle({
                Title: title,
                Content: content
            }, {
                UserId: this.gl.userId,
                Password: this.gl.password
            })
                .subscribe((v) => {
                this.nots.createNotification(new Notification('Success!', 'The article ' + title + ' was created successfully', NotificationType.Success));
                this.router.navigate(['article/' + v]);
            }, (e) => {
                this.nots.createNotification(new Notification('ERROR!', e.ErrorDetails.More, NotificationType.Error));
            });
        }
        else {
            this.nots.createNotification(new Notification('ERROR!', 'You\'re not logged in!', NotificationType.Error));
        }
    }
    keyDown(title, content, event) {
        if (event.key === 'Enter') {
            this.submit(title, content);
        }
    }
};
ArticlesCreatePageComponent = __decorate([
    Component({
        selector: 'app-articles-create-page',
        templateUrl: './articles-create-page.component.html',
        styleUrls: ['./articles-create-page.component.scss']
    })
], ArticlesCreatePageComponent);
export { ArticlesCreatePageComponent };
//# sourceMappingURL=articles-create-page.component.js.map