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

  async ngOnInit() {
    const arts = await this.db.Articles.Get.All();
    this.articles = arts;
    this.done = true;
    }
}
