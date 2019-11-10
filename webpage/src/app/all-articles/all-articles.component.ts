import { Component, OnInit } from '@angular/core';
import { DatabaseService, Article } from '../database.service';

@Component({
  selector: 'app-all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.scss']
})
export class AllArticlesComponent implements OnInit {
  constructor(
    private db: DatabaseService,
  ) { }

  articles = new Array<Article>();
  done = false;

  ngOnInit() {
    this.db.Articles.Get.All((articles) => {
      this.articles = articles;
      this.done = true;
    });
  }

}
