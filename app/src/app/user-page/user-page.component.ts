import { Component, OnInit } from '@angular/core';
import { User, Article, DatabaseService, Error } from '../database.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GlobalsService } from '../globals.service';
import { NotificationsService, Notification, NotificationType } from '../notifications.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  user: User = null;
  private _userId = 0;
  articles: Article[] = [];
  done = false;
  private _followers = 0;
  private _following = 0;
  private _articleAmount = 0;
  private _followed = false;

  public get followers() { return this._followers + (this.followed ? 1 : 0); }
  public get following() { return this._following + (this.followed && this.gs.userId === this._userId ? 1 : 0); }
  public get articleAmount() { return this._articleAmount; }
  public get followed() { return this._followed; }

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private nots: NotificationsService,
    public gs: GlobalsService,
  ) { }

  async ngOnInit() {
    this.update();
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.update();
      }
    });
  }

  updateStats() {
    this._followers = this.user.Followers.length;
    if (this.user.Followers.indexOf(this.gs.userId) > -1) {
      this._followers--;
      this._followed = true;
    }

    this._following = this.user.Following.length;
    if (this.user.Following.indexOf(this.gs.userId) > -1) {
      this._following--;
    }

    this._articleAmount = this.user.Articles.length;
  }

  follow() {
    this._followed = !this._followed;

    if (this.gs.loggedIn) {
      this.db.changeUsers({
        ID: this._userId
      }, {
        Follow: true
      }, {
        Password: this.gs.password,
        UserId: this.gs.userId
      }).subscribe({
        error: (err: Error) => {
          this.nots.createNotification(new Notification('ERROR!', err.ErrorDetails.More, NotificationType.Error));
          this._followed = !this._followed;
        }
      });
    } else {
      this.nots.createNotification(
        new Notification(
          'ERROR!',
          'You must be logged in to follow ' + this.user.Username + '.',
          NotificationType.Error
        )
      );
      this._followed = !this._followed;
    }
  }

  update() {
    this.done = false;
    this._userId = Number.parseFloat(this.activatedRoute.snapshot.paramMap.get('id'));

    this.db.getUserBySelector({ ID: this._userId }).subscribe(
      user => {
        this.user = user;
        this.db.getArticlesBySelector({ OwnerId: this._userId }).subscribe(
          articles => this.articles = articles
          );
        this.updateStats();
        this.done = true;
      }
    );
  }

  removeArticle(articleId: string) {
    this.db.removeArticles({ ID: articleId }, {
      Password: this.gs.password,
      UserId: this.gs.userId
    }).subscribe({
      next: () => {
        this.nots.createNotification(new Notification('Deleted article', 'Successfully deleted article', NotificationType.Success));
      },
      error: (e: Error) => {
        this.nots.createNotification(new Notification('ERROR!', e.ErrorDetails.More, NotificationType.Error));
      }
    });
  }
}
