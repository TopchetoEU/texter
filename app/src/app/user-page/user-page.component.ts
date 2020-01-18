import { Component, OnInit } from '@angular/core';
import { User, Article, DatabaseService } from '../database.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {
  user: User = null;
  articles: Article[] = [];
  done = false;

  constructor(
    private db: DatabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.update();
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.update();
      }
    });
  }
  async update() {
    this.done = false;
    const ownerId = Number.parseFloat(this.activatedRoute.snapshot.paramMap.get('id'));

    this.user = await this.db.Users.Get.ById(ownerId);
    this.articles = await this.db.Articles.Get.BySelector({ OwnerId: ownerId }, {});
    this.done = true;
  }
}
