import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() { }

  public Users = {
    Get: {
      All: (): Promise<User[]> => {
        HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: {}
        }, (users) => {
          return Promise.resolve(users.Found);
        });
        throw null;
      },
      ById: (id: number): Promise<User> => {
        HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { ID: id },
        }, (res) => {
          if (res.Found.length === 1) {
            return Promise.resolve(res.Found[0]);
          } else {
            return Promise.reject({ Error: "No user found" });
          }
        });
        throw null;
      },
      ByName: (name: string): Promise<User> => {
        HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { Username: name },
        }, (res) => {
          if (res.Found.length === 1) {
            return Promise.resolve(res.Found[0]);
          } else {
            return Promise.reject({ Error: "User doesn't exists" });
          }
        });
        throw null;
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
      BySelector: (selector: any): Promise<Article[]> => {
        HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: selector
        }, (articles) => {
          return Promise.resolve(articles.Found);
        });
        return Promise.resolve(null);
      },
      ById: (id: string): Promise<Article[]> => {
        HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: { ID: id   }
        }, (articles) => {
          return Promise.resolve(articles.Found);
        });
        return Promise.resolve(null);
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
