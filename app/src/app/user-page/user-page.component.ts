import { Component, OnInit } from '@angular/core';
import { User, Article, DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';

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
    private router: ActivatedRoute
  ) { }

  async ngOnInit() {
    const ownerId = Number.parseInt(this.router.snapshot.paramMap.get('id'), 10);

    this.user = await this.db.Users.Get.ById(ownerId);
    this.articles = await this.db.Articles.Get.BySelector({ OwnerId: ownerId });
    this.done = true;
  }
}
