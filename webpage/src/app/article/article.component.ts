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

  async ngOnInit() {
    const articleId = this.router.snapshot.paramMap.get('id');
    console.log(articleId);

    this.article = (await this.db.Articles.Get.ById(articleId)[0]);
    this.creator = (await this.db.Users.Get.ById(this.article.OwnerId)).Username;
  }
}
