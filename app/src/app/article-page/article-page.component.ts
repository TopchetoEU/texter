import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService, Article, User } from '../database.service';

@Component({
  selector: 'app-article-page',
  templateUrl: './article-page.component.html',
  styleUrls: ['./article-page.component.scss']
})
export class ArticlePageComponent implements OnInit {
  articleId: string;
  creator: User;

  constructor(
    private router: ActivatedRoute,
    private db: DatabaseService,
  ) { }

  async ngOnInit() {
    this.articleId = this.router.snapshot.paramMap.get('id');
  }
}
