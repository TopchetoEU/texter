import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { Notification, NotificationType } from '../notifications.service';
let LoginPageComponent = class LoginPageComponent {
    constructor(globals, db, r, notifications) {
        this.globals = globals;
        this.db = db;
        this.r = r;
        this.notifications = notifications;
        this.done = true;
    }
    ngOnInit() {
    }
    login(name, password) {
        const err = (e) => {
            this.notifications.createNotification(new Notification(e.ErrorDetails.General, e.ErrorDetails.More, NotificationType.Error));
            this.done = true;
        };
        const succ = () => {
            this.notifications.createNotification(new Notification('Success!', 'Welcome back, ' + name + ' !', NotificationType.Success));
            this.done = true;
            this.r.navigate(['/']);
            return;
        };
        this.done = false;
        this.db.getUserBySelector({ Username: name }).subscribe(user => {
            this.db.checkCredentials({ Password: password, UserId: user.ID }).subscribe(error => {
                if (error.success) {
                    this.globals.userId = user.ID;
                    this.globals.password = password;
                    this.globals.loggedIn = true;
                    succ();
                }
                else {
                    err(error.error);
                }
            });
        }, (e) => {
            err(e);
        });
    }
};
LoginPageComponent = __decorate([
    Component({
        selector: 'app-login-page',
        templateUrl: './login-page.component.html',
        styleUrls: ['./login-page.component.scss']
    })
], LoginPageComponent);
export { LoginPageComponent };
//# sourceMappingURL=login-page.component.js.map