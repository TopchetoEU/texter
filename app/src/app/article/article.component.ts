import { Component, OnInit, Input } from '@angular/core';
import { Article, DatabaseService, Like, Error } from '../database.service';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  @Input()
  public article: Article;

  public username = '';

  // tslint:disable-next-line: variable-name
  private _liked = false;
  // tslint:disable-next-line: variable-name
  private _disliked = false;

  public get liked(): boolean {
    return this._liked;
  }
  public get disliked(): boolean {
    return this._disliked;
  }

  constructor(
    private notifs: NotificationsService,
    public db: DatabaseService,
    private globals: GlobalsService
  ) { }

  async ngOnInit() {
    this.username = (await this.db.Users.Get.ById(this.article.OwnerId)).Username;
    this.updateLikeButtons();
  }
  async updateLikeButtons() {
    if (this.globals.loggedIn) {
      const artcl = await this.db.Articles.Get.ById(this.article.ID);

      console.log(artcl);

      this._liked =    artcl.Likers[this.globals.userId] === 1;
      this._disliked = artcl.Likers[this.globals.userId] === -1;
    }
  }

  like(id: number, like: number) {
    const err = (e: Error) => {
        this.notifs.createNotification(new Notification(e.ErrorDetails.General, e.ErrorDetails.More, NotificationType.Error));
    };
    if (!this.globals.loggedIn) {
      err(new Error('Log in.', 'You must be logged in to like and dislike content.'));
    } else {
      this.db.Articles.Change({ ID: id }, {
        UserId: this.globals.userId,
        Password: this.globals.password
      }, {
        Like: like
      }).then(() => {
        setTimeout(() => this.updateLikeButtons(), 10);
      }).catch((e) => {
        err(e);
      });
    }
  }
}
