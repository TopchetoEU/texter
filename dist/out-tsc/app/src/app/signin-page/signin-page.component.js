import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Error } from '../database.service';
import { NotificationType, Notification } from '../notifications.service';
let SigninPageComponent = class SigninPageComponent {
    constructor(db, r, notifications) {
        this.db = db;
        this.r = r;
        this.notifications = notifications;
        this.done = true;
    }
    signin(name, password, password2) {
        const err = (e) => {
            this.done = true;
            this.notifications.createNotification(new Notification(e.ErrorDetails.General, e.ErrorDetails.More, NotificationType.Error));
            return;
        };
        const succ = () => {
            this.done = true;
            this.notifications.createNotification(new Notification('Success!', 'Now log in.', NotificationType.Success));
            this.r.navigate(['/']);
            return;
        };
        if (password !== password2) {
            err(new Error('Two passwords don\'t match.', 'Password and password confirmation don\'t mach up'));
        }
        this.done = false;
        this.db.createUser({ Username: name, Password: password })
            .subscribe(() => {
            succ();
        }, (e) => {
            err(e);
        });
    }
};
SigninPageComponent = __decorate([
    Component({
        selector: 'app-signin-page',
        templateUrl: './signin-page.component.html',
        styleUrls: ['./signin-page.component.scss']
    })
], SigninPageComponent);
export { SigninPageComponent };
//# sourceMappingURL=signin-page.component.js.map