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
  private _followed = false;

  public get followers() { return this._followers + (this.followed ? 1 : 0); }
  public get following() { return this._following; }
  public get followed() { return this._followed; }


  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private gs: GlobalsService,
    private nots: NotificationsService
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

    this._followers = this.user.Followers.length;
  }

  follow() {
    this._followed = !this._followed;

    this.db.changeUsers({
      ID: this._userId
    }, {
      Follow: true
    }, {
      Password: this.gs.password,
      UserId: this.gs.userId
    }).subscribe(
      null, (err: Error) => {
        this.nots.createNotification(new Notification('ERROR!', err.ErrorDetails.More, NotificationType.Error));
        this._followed = !this._followed;
      }
    );
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
        this.done = true;
      }
    );
  }
}
