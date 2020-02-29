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
  private _likeAmount = 0;
  // tslint:disable-next-line: variable-name
  private _disliked = false;
  // tslint:disable-next-line: variable-name
  private _dislikeAmount = 0;

  public get liked(): boolean {
    return this._liked;
  }
  public get disliked(): boolean {
    return this._disliked;
  }

  public get likeAmount(): number {
    return this._likeAmount + (this.liked ? 1 : 0);
  }

  public get dislikeAmount(): number {
    return this._dislikeAmount + (this.disliked ? 1 : 0);
  }

  constructor(
    private notifs: NotificationsService,
    public db: DatabaseService,
    private globals: GlobalsService
  ) { }

  async ngOnInit() {
    this.username = (await this.db.Users.Get.ById(this.article.OwnerId)).Username;
    const artcl = await this.db.Articles.Get.ById(this.article.ID);

    if (this.globals.loggedIn) {

      this._liked =    artcl.Likers[this.globals.userId] === 1;
      this._disliked = artcl.Likers[this.globals.userId] === -1;
    }

    for (const user in artcl.Likers) {
      if (Number.parseFloat(user) !== this.globals.userId) {
        if (artcl.Likers[user] === -1) {
          this._dislikeAmount++;
        } else if (artcl.Likers[user] === 1) {
          this._likeAmount++;
        }
      }
    }
  }

  like(id: string, like: number) {
    let newLike = like;

    if (this.liked && like === 1 || this.disliked && like === -1) {
      newLike = 0;
    }
    const err = (e: Error) => {
        this.notifs.createNotification(new Notification(e.ErrorDetails.General, e.ErrorDetails.More, NotificationType.Error));
    };
    if (!this.globals.loggedIn) {
      err(new Error('Log in.', 'You must be logged in to newLike and dislike content.'));
    } else {
      this._liked = newLike === 1;
      this._disliked = newLike === -1;

      this.db.Articles.Change({ ID: id }, {
        UserId: this.globals.userId,
        Password: this.globals.password
      }, {
        Like: like,
        DoModify: true,
      }).catch((e) => {
        err(e);
      });
    }
  }
}
