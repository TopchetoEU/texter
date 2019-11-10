import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() { }

  public Users = {
    Get: {
      All: (callback: (users: User[]) => void): void => {
        HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: {}
        }, (users) => {
          callback(users.Found);
        });
      },
      ById: (id: number, callback: (users: User[]) => void) => {
        HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { ID: id },
        }, (res) => {
          callback(res.Found);
        });
      }
    }
  };
  public Articles = {
    Get: {
      All: (callback: (articles: Article[]) => void): void => {
        HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: {}
        }, (articles) => {
          callback(articles.Found);
        });
      },
      BySelector: (selector: any, callback: (articles: Article[]) => void): void => {
        HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: selector
        }, (articles) => {
          callback(articles.Found);
        });
      },
      ById: (id: string, callback: (articles: Article[]) => void): void => {
        HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: { ID: id   }
        }, (articles) => {
          callback(articles.Found);
        });
      }
    }
  };
}

export class HTTP {
  public static Post(url: string, body: object, callback: (res: any) => void): void {
    const a = new XMLHttpRequest();
    a.open('POST', url);
    a.onreadystatechange = () => {
      if (a.readyState === 4) {
        callback(JSON.parse(a.response));
      }
    };
    a.send( JSON.stringify(body));
  }
}

export class User {
  public ID: number;
  public Username: string;
  public Password: string;
  public Followers: number[];
  public Following: number[];
  public Articles: string[];
}

export class Article {
  public ID: number;
  public Title: string;
  public Content: string;
  public OwnerId: number;
  public Likers: any;
  public Articles: string[];
}
