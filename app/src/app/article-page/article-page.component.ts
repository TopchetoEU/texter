import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Article, User } from '../database.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {
  article: Article;
  creator: User;
  done = false;

  constructor(
    private router: ActivatedRoute,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    const articleId = this.router.snapshot.paramMap.get('id');

    this.article = await this.db.Articles.Get.ById(articleId);
    this.creator = await this.db.Users.Get.ById(this.article.OwnerId);
    this.done = true;
  }
}
