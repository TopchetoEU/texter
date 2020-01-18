import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() { }

  public Users = {
    Get: {
      All: async (): Promise<User[]> => {
        const users = await HTTP.Post('http://46.249.77.12:4001/users/get', { Selector: {} });
        return Promise.resolve(users.Found);
      },
      BySelector: async (selector, options?): Promise<User[]> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/users/get', { Selector: selector, ...options });
        return Promise.resolve(res.Found);
      },
      ById: async (id: number): Promise<User> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { ID: id },
        });
        if (res.Found.length === 1) {
          return Promise.resolve(res.Found[0]);
        } else {
          return Promise.reject(new Error('No user is found', 'Are you misspelling the name'));
        }
      },
      ByName: async (name: string): Promise<User> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { Username: name },
        });
        if (res.Found.length === 1) {
          return Promise.resolve(res.Found[0]);
        } else if (res.Found.length < 1) {
          return Promise.reject(new Error('No user is found', 'Are you misspelling the name'));
        } else if (res.Found.length > 1) {
          return Promise.reject(new Error('DB Error', 'The DB\'s feeling a bit meshed up today.'));
        }
      }
    },
    Create: async (newUser: { Username: string, Password: string }): Promise<number> => {
      const result = await HTTP.Post('http://46.249.77.12:4001/users/create', {
        New: newUser
      });
      if (result.Error.Error === true) {
        throw result.Error;
      } else {
        console.log(result);
        return result.NewID;
      }
    },
  };
  public Articles = {
    Get: {
      All: async (): Promise<Article[]> => {
        const articles = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: {}
        });
        return Promise.resolve(articles.Found);
      },
      BySelector: async (selector: any, options: any): Promise<Article[]> => {
        const articles = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: selector,
          ...options,
        });
        return Promise.resolve(articles.Found);
      },
      ById: async (id: string): Promise<Article> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: { ID: id }
        });
        if (res.Found.length === 1) {
          return Promise.resolve(res.Found[0]);
        } else if (res.Found.length < 1) {
          return Promise.reject(new Error('No aritlce is found', 'Are you misspelling the title?'));
        } else if (res.Found.length > 1) {
          return Promise.reject(new Error('DB Error', 'The DB had a party last night and it\'s now druk.'));
        }
      }
    },
    Change: async (selector: any, credentials: Credentials, options: ChangeOptions) => {
      const body: any = {
        Selector: selector,
        Credentials: credentials,
        Like: options.Like || undefined,
        DoModify: options.DoModify || false,
      };

      if (options.Modify) {
        options.Modify.forEach(pair => {
          body.Modify[pair.Propname] = pair.Value;
        });
      }

      HTTP.Post('http://46.249.77.12:4001/articles/change', body).then((res) => {
        if (res.Error.Error) {
          throw res.Error as Error;
        }
      });

    }
  };
  public async checkCredentials(credentials: Credentials): Promise<{ error: Error, success: boolean }> {
    const res = await HTTP.Post('http://46.249.77.12:4001/others/checkCreds', { Credentials: credentials });
    return Promise.resolve(res);
  }

  public async searchAll(value: string): Promise<{ Users: User[], Articles: Article[] }> {
    const regex = '(' + value.split(/[, ]/g).join(')(') + ')';

    const users: User[] = await this.Users.Get.BySelector({
      DoPaging: true,
      Paging: {
        PageSize: 20,
        PageCount: 0,
      },
      Selector: {
        Username: { $regex: regex }
      }
    });
    const articles: Article[] = await this.Articles.Get.BySelector({
      DoPaging: true,
      Paging: {
        PageSize: 20,
        PageCount: 0,
      },
      Selector: {
        Title: { $regex: regex }
      }
    }, {});

    return Promise.resolve({ Users: users, Articles: articles });
  }
}

export interface ChangeOptions {
  Like?: number;
  DoModify?: boolean;
  Modify?: PropertyChangeValuePair[];
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

export interface Credentials {
  UserId: number;
  Password: string;
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
  public Articles: string[];
}

export enum Method {
  GET,
  HEAD,
  POST,
  PUT,
  DELETE,
  CONNECT,
  OPTIONS,
  TRACE,
  PATCH
}
export interface Request {
  method: Method;
  url: string;
  headers: Array<{ name: string, value: any }>;
  body: any;
}
export class HTTP {
  private static request = (obj: Request): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(Method[obj.method], obj.url);
      if (obj.headers) {
        obj.headers.forEach(header => {
          xhr.setRequestHeader(header.name, header.value);
        });
      }
      xhr.onload = () => {
        if (xhr.readyState === 4) {
          let a = xhr.response;
          try {
            a = JSON.parse(a);
          } catch (b) {
            a = xhr.response;
          }

          resolve(a);
        }
      };
      xhr.send(JSON.stringify(obj.body));
    });
  }

  public static async Post(url: string, body: any): Promise<any> {
    const d = await HTTP.request({
      body,
      headers: [],
      method: Method.POST,
      url,
    }).catch((e) => {
      console.log(e);
    });

    return Promise.resolve(d);
  }
}

export class Error {
  public static noError: Error = Object.freeze({
    Error: false,
    ErrorDetails: null,
  });

  public ErrorDetails: ErrorDetails;
  public Error: boolean;

  public constructor(general: string, more: string) {
    this.ErrorDetails = new ErrorDetails(general, more);
    this.Error = true;
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
