import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { User, DatabaseService, Article } from '../database.service';
import { fromEvent, Subject } from 'rxjs';
import { throttleTime, takeUntil, distinct, delay } from 'rxjs/operators';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit, OnDestroy {
  @ViewChild('in', { static: true })
  public searchInput: ElementRef;
  foundUsers: User[] = [];
  destruction: Subject<void> = new Subject();

  constructor(
    private db: DatabaseService
  ) { }

  ngOnDestroy() {
    this.destruction.next();
    this.destruction.complete();
  }

  ngOnInit() {
    const el = (this.searchInput.nativeElement as HTMLInputElement);
    const a = fromEvent(el, 'keydown')
      .pipe(throttleTime(200),
      distinct(() => el.value),
      takeUntil(this.destruction),
      delay(500))
      .subscribe(async () => {
        this.foundUsers = await (await this.db.searchAll(el.value)).Users;
      });

  }
}
