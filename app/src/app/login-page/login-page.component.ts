import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService, Error } from '../database.service';
import { Router } from '@angular/router';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

    constructor(
        private globals: GlobalsService,
        private db: DatabaseService,
        public r: Router,
        private notifications: NotificationsService,
    ) { }

    done = true;

    ngOnInit() {
    }

    login(name, password) {
        const err = (e: Error) => {
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
                } else {
                    err(error.error);
                }
            });
        },
        (e) => {
            err(e);
        });
    }
}
