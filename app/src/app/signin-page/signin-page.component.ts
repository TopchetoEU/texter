import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService, Error } from '../database.service';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType, Notification } from '../notifications.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent {
  constructor(
    private db: DatabaseService,
    public r: Router,
    private notifications: NotificationsService
  ) { }

  done = true;

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
    this.db.Users.Create({ Username: name, Password: password })
      .then(() => {
        succ();
      }).catch((e) => {
        err(e);
      });
  }
}
