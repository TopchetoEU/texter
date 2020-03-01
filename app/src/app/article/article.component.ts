import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Article, DatabaseService, Like, Error } from '../database.service';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';
import { GlobalsService } from '../globals.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  public article: Article;
  public username = '';

  private months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  @Input()
  public get articleId(): string {
    return this._articleId;
  }
  public set articleId(value: string) {
    this._articleId = value;
    this.refresh();
  }
  _articleId: string;

  private _liked = false;
  private _likeAmount = 0;
  private _disliked = false;
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
    private globals: GlobalsService,
    private zone: NgZone
  ) { }

  ngOnInit() {
  }

  public toDateFormat(uch: number) {
    const date = new Date(uch);
    return `${(date.getDay() + 1)}` +
      `${(date.getDay() + 1) % 10 === 1 ?
        'st' : ((date.getDay() + 1) % 10 === 2 ?
        'nd' : ((date.getDay() + 1) % 10 === 3 ?
        'rd' : 'th'))}` +
      ` of ${this.months[date.getMonth()]}, ${date.getFullYear()}`;
  }

  refresh = () => {
    const t = this;
    this.zone.run(() => {
      t.db.getArticleBySelector({ ID: this.articleId }).subscribe(
        artcl => {
          this.article = artcl;

          t.db.getUserBySelector({ ID: artcl.OwnerId }).subscribe(
            user => {
              t.username = user.Username;

              if (t.globals.loggedIn) {
                t._liked = artcl.Likers[t.globals.userId] === 1;
                t._disliked = artcl.Likers[t.globals.userId] === -1;
              }

              for (const user1 in artcl.Likers) {
                if (Number.parseFloat(user1) !== t.globals.userId) {
                  if (artcl.Likers[user1] === -1) {
                    t._dislikeAmount++;
                  } else if (artcl.Likers[user1] === 1) {
                    t._likeAmount++;
                  }
                }
              }
            }
          );
        }
      );
    });
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
      err(new Error('Log in.', 'You must be logged in to like and dislike content.'));
    } else {
      this._liked = newLike === 1;
      this._disliked = newLike === -1;

      this.db.changeArticles({ ID: id }, {
        Like: like,
      }, {
        UserId: this.globals.userId,
        Password: this.globals.password
      }).subscribe({
        error: (e) => {
        err(e);
      }});
    }
  }
}
