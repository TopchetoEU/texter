import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const url = 'http://texterme.eu:4000/';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private http: HttpClient
  ) { }

  public getAllArticles(): Observable<Article[]> {
    return new Observable<Article[]>(ob => {
      this.http.post<any>(url + 'articles/get', { Selector: {} }).subscribe(val => {
        if (val.Error.Error === true) {
          ob.error(val.Error);
        }
        ob.next(val.Found);
      });
    });
  }
  public getArticleBySelector(selector: any, options?: GetOptions): Observable<Article> {
    return new Observable<Article>(
      ob => {
        this.http.post<any>(url + 'articles/get', { Selector: selector, ...options })
          .subscribe(val => {
            if (val.Found.length === 1) {
              ob.next(val.Found[0]);
            } else if (val.Found.length < 1) {
              ob.error(new Error('No article is found', 'Are you misspelling the title'));
            } else if (val.Found.length > 1) {
              ob.error(new Error('DB Error', 'The DB\'s feeling a bit meshed up today.'));
            }
            ob.complete();
          });
      }
    );
  }
  public getArticlesBySelector(selector: any, options?: GetOptions, one?: boolean): Observable<Article[]> {
    return new Observable<Article[]>(ob => {
      this.http.post<any>(url + 'articles/get', { Selector: selector, ...options }).subscribe(
        val => {
          if (val.Error.Error === true) {
            ob.error(val.Error);
          } else {
            ob.next(val.Found);
          }
        }
      );
    });
  }
  public changeArticles(selector: any, options: ArticleChangeOptions, credentials: Credentials) {
    const body = {
      Selector: selector,
      Credentials: credentials,
      Like: options.Like,
      DoModify: (options.Modify && options.Modify.length > 0) || options.Like,
      Modify: {}
    };
    const modify: any = {};

    if (options.Modify) {
      options.Modify.forEach(el => {
        modify[el.Propname] = el.Value;
      });
    }

    body.Modify = modify;

    return this.http.post(url + 'articles/change', body);
  }
  public createArticle(newArticle: NewArticle, credentials: Credentials): Observable<string> {
    return new Observable<string>(ob => {
      this.http.post<any>(url + 'articles/create', {
        Credentials: credentials,
        New: newArticle
      }).subscribe(val => {
        if (val.Error.Error) {
          ob.error(val.Error);
        } else {
          ob.next(val.NewID);
        }
      });
    });
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.post<User[]>(url + 'users/get', { Selector: {} });
  }
  public getUserBySelector(selector: any, options?: GetOptions): Observable<User> {
    return new Observable<User>(
      ob => {
        this.http.post<any>(url + 'users/get', { Selector: selector, ...options })
          .subscribe(val => {
            if (val.Found.length === 1) {
              ob.next(val.Found[0]);
            } else if (val.Found.length < 1) {
              ob.error(new Error('No user is found', 'Are you misspelling the username'));
            } else if (val.Found.length > 1) {
              ob.error(new Error('DB Error', 'The DB\'s feeling a bit meshed up today.'));
            }
            ob.complete();
          });
      }
    );
  }
  public getUsersBySelector(selector: any, options?: GetOptions): Observable<User[]> {
    return new Observable<User[]>(ob => {
      this.http.post<any>(url + 'users/get', { Selector: selector, ...options }).subscribe(
        val => {
          if (val.Error.Error === true) {
            ob.error(val.Error);
          } else {
            ob.next(val.Found);
          }
        }
      );
    });
  }
  public changeUsers(selector: any, options: UserChangeOptions, credentials: Credentials) {
    const body = {
      Selector: selector,
      Credentials: credentials,
      Follow: options.Follow,
      DoModify: options.Follow || options.Modify.length > 0,
      Modify: {}
    };
    const modify: any = {};

    if (options.Modify) {
      options.Modify.forEach(el => {
        modify[el.Propname] = el.Value;
      });
    }

    body.Modify = modify;

    return new Observable(ob => {
      this.http.post<any>(url + 'users/change', body).subscribe(
        val => {
          if (val.Error.Error) {
            ob.error(val.Error);
          }
      });
    });
  }
  public createUser(newUser: NewUser): Observable<number> {
    return new Observable<number>(ob => {
      this.http.post<any>(url + 'users/create', {
        New: newUser
      }).subscribe(val => {
        if (val.Error.Error) {
          ob.error(val.Error);
        } else {
          ob.next(val.NewID);
        }
      });
    });
  }

  public checkCredentials(credentials: Credentials): Observable<CredentialsCheckResponse> {
    return this.http.post<CredentialsCheckResponse>(url + 'others/checkCreds', { Credentials: credentials });
  }

  public searchAll(value: string): Observable<{ Users: User[], Articles: Article[] }> {
    const regex = '(' + value.split(/[, ]/g).join(')(') + ')';

    console.log(regex);

    return new Observable(ob => {
      this.getUsersBySelector(
        {
          Username: { $regex: regex }
        },
        {
          DoPaging: true,
          Paging: {
            PageSize: 20,
            PageCount: 0,
          }
      }).subscribe(users => {
        this.getArticlesBySelector(
          {
            Title: { $regex: regex }
          },
          {
            DoPaging: true,
              Paging: {
                PageSize: 20,
                PageCount: 0,
              }
          }).subscribe(articles => {
            ob.next({ Users: users, Articles: articles });
          });
      });
    });
  }
}
export interface CredentialsCheckResponse {
  error: Error;
  success: boolean;
}

export interface NewArticle {
  Title: string;
  Content: string;
}
export interface NewUser {
  Username: string;
  Password: string;
}

export interface UserChangeOptions {
  Follow?: boolean;
  Modify?: PropertyChangeValuePair[];
}
export interface ArticleChangeOptions {
  Like?: number;
  Modify?: PropertyChangeValuePair[];
}
export interface GetOptions {
  DoPaging: boolean;
  Paging: PagingOptions|undefined;
}
export interface PagingOptions {
  PageSize: number;
  PageCount: number;
}

export interface PropertyChangeValuePair {
  Propname: string;
  Value: any;
}
export enum Like {
  Neutralise,
  Dislike,
  Like,
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
  public ID: string;
  public Title: string;
  public Content: string;
  public OwnerId: number;
  public Likers: any;
}

export class Error {
  public static NoError = new Error();

  Error: boolean;
  ErrorDetails: ErrorDetails|undefined;

  constructor(general?: string, more?: string) {
    if (general && more) {
      this.Error = true;
      this.ErrorDetails = new ErrorDetails(general, more);
    } else {
      this.Error = false;
    }
  }
}
export class ErrorDetails {
  public General: string;
  public More: string;

  public constructor(general: string, more: string) {
    this.General = general;
    this.More = more;
  }
}
export interface Credentials {
  UserId: number;
  Password: string;
}
