import { Component, OnInit } from '@angular/core';
import { User, Article, DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User = null;
  articles: Article[] = [];
  done = false;

  constructor(
    private db: DatabaseService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    const ownerId = Number.parseInt(this.router.snapshot.paramMap.get('id'), 10);

    this.db.Users.Get.ById(ownerId, (users) => {
      if (users.length > 0) {
        this.user = users[0];
        this.db.Articles.Get.BySelector({ OwnerId: ownerId }, (articles) => {
          this.articles = articles;
          this.done = true;
        });
      }
    });
  }

}
