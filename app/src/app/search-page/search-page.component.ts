import { Component, OnInit } from '@angular/core';
import { User, DatabaseService, Article } from '../database.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(
    private db: DatabaseService
  ) { }

  ngOnInit() {
  }

  async search(value: string): { Users: User[], Articles: Article[] } {
    const searchKeywords = value.split(/[, ]/g);
    let regex = '';
    searchKeywords.forEach(keyword => {
      regex += `(${keyword})`;
    });
    const users: User[] = await this.db.Users.Get.BySelector({
      DoPaging: true,
      Paging: {
        PageSize: 20,
        PageCount: 0,
      },
      Selector: {
        Username: { $regEx: regex }
      }
    });
  }
}
