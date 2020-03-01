import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
import { Error } from '../database.service';
import { Notification, NotificationType } from '../notifications.service';
let ArticleComponent = class ArticleComponent {
    constructor(notifs, db, globals, zone) {
        this.notifs = notifs;
        this.db = db;
        this.globals = globals;
        this.zone = zone;
        this.username = '';
        // tslint:disable-next-line: variable-name
        this._liked = false;
        // tslint:disable-next-line: variable-name
        this._likeAmount = 0;
        // tslint:disable-next-line: variable-name
        this._disliked = false;
        // tslint:disable-next-line: variable-name
        this._dislikeAmount = 0;
        this.refresh = () => {
            const t = this;
            this.zone.run(() => {
                t.db.getArticleBySelector({ ID: this.articleId }).subscribe(artcl => {
                    this.article = artcl;
                    t.db.getUserBySelector({ ID: artcl.OwnerId }).subscribe(user => {
                        console.log(user);
                        t.username = user.Username;
                        if (t.globals.loggedIn) {
                            t._liked = artcl.Likers[t.globals.userId] === 1;
                            t._disliked = artcl.Likers[t.globals.userId] === -1;
                        }
                        for (const user1 in artcl.Likers) {
                            if (Number.parseFloat(user1) !== t.globals.userId) {
                                if (artcl.Likers[user1] === -1) {
                                    t._dislikeAmount++;
                                }
                                else if (artcl.Likers[user1] === 1) {
                                    t._likeAmount++;
                                }
                            }
                        }
                    });
                });
            });
        };
    }
    get articleId() {
        return this._articleId;
    }
    set articleId(value) {
        this._articleId = value;
        this.refresh();
    }
    get liked() {
        return this._liked;
    }
    get disliked() {
        return this._disliked;
    }
    get likeAmount() {
        return this._likeAmount + (this.liked ? 1 : 0);
    }
    get dislikeAmount() {
        return this._dislikeAmount + (this.disliked ? 1 : 0);
    }
    ngOnInit() {
    }
    like(id, like) {
        let newLike = like;
        if (this.liked && like === 1 || this.disliked && like === -1) {
            newLike = 0;
        }
        const err = (e) => {
            this.notifs.createNotification(new Notification(e.ErrorDetails.General, e.ErrorDetails.More, NotificationType.Error));
        };
        if (!this.globals.loggedIn) {
            err(new Error('Log in.', 'You must be logged in to newLike and dislike content.'));
        }
        else {
            this._liked = newLike === 1;
            this._disliked = newLike === -1;
            this.db.changeArticles({ ID: id }, {
                Like: like,
            }, {
                UserId: this.globals.userId,
                Password: this.globals.password
            }).subscribe(null, (e) => {
                err(e);
            });
        }
    }
};
__decorate([
    Input()
], ArticleComponent.prototype, "articleId", null);
ArticleComponent = __decorate([
    Component({
        selector: 'app-article',
        templateUrl: './article.component.html',
        styleUrls: ['./article.component.scss']
    })
], ArticleComponent);
export { ArticleComponent };
//# sourceMappingURL=article.component.js.map