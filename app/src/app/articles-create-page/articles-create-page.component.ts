import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService, Error } from '../database.service';
import { GlobalsService } from '../globals.service';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles-create-page',
  templateUrl: './articles-create-page.component.html',
  styleUrls: ['./articles-create-page.component.scss']
})
export class ArticlesCreatePageComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    private gl: GlobalsService,
    private nots: NotificationsService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit(title: string, content: string) {
    if (this.gl.loggedIn) {
      this.db.createArticle(
        {
          Title: title,
          Content: content
        },
        {
          UserId: this.gl.userId,
          Password: this.gl.password
        })
        .subscribe((v) => {
          this.nots.createNotification(new Notification(
            'Success!',
            'The article ' + title + ' was created successfully',
            NotificationType.Success
          ));
          this.router.navigate(['article/' + v]);
        }, (e: Error) => {
          this.nots.createNotification(new Notification(
            'ERROR!',
            e.ErrorDetails.More,
            NotificationType.Error
          ));
      });
    } else {
      this.nots.createNotification(new Notification('ERROR!', 'You\'re not logged in!', NotificationType.Error));
    }
  }

  keyDown(title: string, content: string, event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.submit(title, content);
    }
  }
}
