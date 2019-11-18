import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Article, User } from '../database.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article;
  creator: User;
  done = false;

  constructor(
    private router: ActivatedRoute,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    const articleId = this.router.snapshot.paramMap.get('id');

    this.article = (await this.db.Articles.Get.ById(articleId))[0];
    this.creator = await this.db.Users.Get.ById(this.article.OwnerId);
    this.done = true;
  }
}
