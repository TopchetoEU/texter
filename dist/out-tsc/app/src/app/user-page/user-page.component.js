import { __awaiter, __decorate } from "tslib";
import { Component } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Notification, NotificationType } from '../notifications.service';
let UserPageComponent = class UserPageComponent {
    constructor(db, activatedRoute, router, gs, nots) {
        this.db = db;
        this.activatedRoute = activatedRoute;
        this.router = router;
        this.gs = gs;
        this.nots = nots;
        this.user = null;
        this._userId = 0;
        this.articles = [];
        this.done = false;
        this._followers = 0;
        this._following = 0;
        this._followed = false;
    }
    get followers() { return this._followers + (this.followed ? 1 : 0); }
    get following() { return this._following; }
    get followed() { return this._followed; }
    ngOnInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.update();
            this.router.events.subscribe(val => {
                if (val instanceof NavigationEnd) {
                    this.update();
                }
            });
        });
    }
    updateStats() {
        this._followers = this.user.Followers.length;
        if (this.user.Followers.indexOf(this.gs.userId) > -1) {
            this._followers--;
            this._followed = true;
        }
        this._followers = this.user.Followers.length;
    }
    follow() {
        this._followed = !this._followed;
        this.db.changeUsers({
            ID: this._userId
        }, {
            Follow: true
        }, {
            Password: this.gs.password,
            UserId: this.gs.userId
        }).subscribe(null, (err) => {
            this.nots.createNotification(new Notification('ERROR!', err.ErrorDetails.More, NotificationType.Error));
            this._followed = !this._followed;
        });
    }
    update() {
        this.done = false;
        this._userId = Number.parseFloat(this.activatedRoute.snapshot.paramMap.get('id'));
        this.db.getUserBySelector({ ID: this._userId }).subscribe(user => {
            this.user = user;
            this.db.getArticlesBySelector({ OwnerId: this._userId }).subscribe(articles => this.articles = articles);
            this.done = true;
        });
    }
};
UserPageComponent = __decorate([
    Component({
        selector: 'app-user',
        templateUrl: './user-page.component.html',
        styleUrls: ['./user-page.component.scss']
    })
], UserPageComponent);
export { UserPageComponent };
//# sourceMappingURL=user-page.component.js.map