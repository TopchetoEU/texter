import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Article } from '../database.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article = null;
  creator: string;
  done = false;

  constructor(
    private router: ActivatedRoute,
    private db: DatabaseService,
  ) { }

  ngOnInit() {
    const articleId = this.router.snapshot.paramMap.get('id');
    console.log(articleId);

    this.db.Articles.Get.ById(articleId, (articles) => {
      if (articles.length > 0) {
        this.article = articles[0];
        this.db.Users.Get.ById(this.article.OwnerId, (users) => {
          this.creator = users[0].Username;
          this.done = true;
        });
      }
    });
  }
}
