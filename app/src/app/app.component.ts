import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { GlobalsService } from './globals.service';
import { Article, User, DatabaseService } from './database.service';
import { fromEvent, Observer, Observable, interval } from 'rxjs';
import { throttleTime, distinct, takeUntil, delay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType, Notification } from './notifications.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('search', { static: true })
  public searchInput: ElementRef;
  @ViewChild('results', { static: true })
  public results: ElementRef;
  foundUsers: User[] = [];
  foundArticles: Article[] = [];

  resultsOnFocus = false;

  styleInterval: Observable<number> = interval(50);

  constructor(
    public gs: GlobalsService,
    private db: DatabaseService,
    private router: Router,
    public notifs: NotificationsService
  ) { }

  leftItems: Array<{ path: string, name: string, icon: string }> = [
    { name: 'Home', path: '/', icon: 'home' },
  ];
  accountOptions: Array<{ path: string, name: string }> = [
    { name: 'Log in', path: '/logIn' },
    { name: 'Sign in', path: '/signIn' },
  ];

  redirect(url: string) {
    this.router.navigate([url]);
  }

  enterPressed(ev: KeyboardEvent, userId: string) {
    console.log(ev);
    if (ev.key === 'Enter') {
      this.redirect('user/' + userId.toString());
    }
  }

  ngAfterViewInit(): void {
    const el = (this.searchInput.nativeElement as HTMLInputElement);
    fromEvent(el, 'input')
      .subscribe(async () => { this.updateSearchElements(el) });

    this.styleInterval.subscribe(() => {
      this.updateSearchView(this.results.nativeElement as HTMLElement, this.searchInput.nativeElement as HTMLElement);
    });
  }

  async updateSearchElements(el: HTMLInputElement) {
    if (el.value.split(' ').join('').length > 0) {
      const s = await this.db.searchAll(el.value);
      this.foundUsers = s.Users;
      this.foundArticles = s.Articles;
    } else {
      this.foundUsers = [];
      this.foundArticles = [];
    }
  }

  clearSearchElement(el: HTMLInputElement) {
    el.value = '';
    this.foundUsers = [];
    this.foundArticles = [];
  }

  getNotificationName(notType: NotificationType) {
    return NotificationType[notType];
  }

  updateSearchView(anchoredElement: HTMLElement, anchorElement: HTMLElement) {
    if (this.foundUsers.length > 0 || this.foundArticles.length > 0) {
      const rect = anchorElement.getBoundingClientRect();

      const x = rect.left - window.scrollX;
      const y = rect.bottom;
      const width = anchorElement.getBoundingClientRect().width;

      anchoredElement.style.top = y + 'px';
      anchoredElement.style.left = x + 'px';
      anchoredElement.style.width = width + 'px';
      anchoredElement.style.display = '';
    } else {
      anchoredElement.style.display = 'none';
    }
  }

  destroyNotificaton(notif: Notification, el: HTMLElement) {
    notif.destroy();
  }
}
