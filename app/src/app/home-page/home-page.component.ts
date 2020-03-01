import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article, DatabaseService, Error, Like } from '../database.service';
import { GlobalsService } from '../globals.service';
import { NotificationType, Notification, NotificationsService } from '../notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  index = 0;
  articlesEnded = false;
  intervalId;

  constructor(
    public db: DatabaseService,
    private globals: GlobalsService,
    private notifs: NotificationsService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.intervalId = setInterval(() => {
      this.loadNewContent();
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  loadNewContent() {
    if (!this.articlesEnded && this.contentLoadRequired()) {
      this.db.getArticlesBySelector({}, {
        DoPaging: true,
        Paging: {
          PageSize: 20,
          PageCount: this.index,
        }
      }).subscribe(articles => {
        console.log(this.articles);
        if (articles.length > 0) {
          articles.forEach(v => {
            this.articles.push(v);
          });

          this.index++;
        } else {
          this.articlesEnded = true;
        }
      });
    }
  }

  contentLoadRequired(): boolean {
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.getBoundingClientRect().height;
    const scroll = window.scrollY;

    return scroll > bodyHeight - 2 * windowHeight;
  }
}
