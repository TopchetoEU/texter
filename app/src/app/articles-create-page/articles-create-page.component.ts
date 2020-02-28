import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatabaseService, Error } from '../database.service';
import { GlobalsService } from '../globals.service';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';

@Component({
  selector: 'app-articles-create-page',
  templateUrl: './articles-create-page.component.html',
  styleUrls: ['./articles-create-page.component.scss']
})
export class ArticlesCreatePageComponent implements OnInit {

  constructor(
    private db: DatabaseService,
    private gl: GlobalsService,
    private nots: NotificationsService
  ) { }

  ngOnInit() {
  }

  submit (title: string, content: string) {
    this.db.Articles.Create(
      {
        Title: title,
        Content: content
      },
      {
        UserId: this.gl.userId,
        Password: this.gl.password
      })
      .then(() => {
        console.log('aaaa');
      }).catch((e: Error) => {
        this.nots.createNotification(new Notification(
          'ERROR!',
          e.ErrorDetails.More,
          NotificationType.Error
        ));
      });
  }
}
