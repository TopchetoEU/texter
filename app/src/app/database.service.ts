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
      ById: async (id: number): Promise<User> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { ID: id },
        });
        if (res.Found.length === 1) {
          return Promise.resolve(res.Found[0]);
        } else {
          return Promise.reject({ Error: "No user found" });
        }
      },
      ByName: async (name: string): Promise<User> => {
        const res = await HTTP.Post('http://46.249.77.12:4001/users/get', {
          Selector: { Username: name },
        });
        if (res.Found.length === 1) {
          return Promise.resolve(res.Found[0]);
        } else {
          return Promise.reject({ Error: "User doesn't exists" });
        }
      }
    }
  };
  public Articles = {
    Get: {
      All: async (): Promise<Article[]> => {
        const articles = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: {}
        });
        return Promise.resolve(articles.Found);
      },
      BySelector: async (selector: any): Promise<Article[]> => {
        const articles = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: selector
        });
        return Promise.resolve(articles.Found);
      },
      ById: async (id: string): Promise<Article[]> => {
        const articles = await HTTP.Post('http://46.249.77.12:4001/articles/get', {
          Selector: { ID: id }
        });
        return Promise.resolve(articles.Found);
      }
    }
  };
  public async checkCredentials(credentials: Credentials): Promise<{ error: Error, success: boolean }> {
    const res = await HTTP.Post('http://46.249.77.12:4001/others/checkCreds', credentials);
    return Promise.resolve(res);
  }
}

export interface Credentials {
  UserId: number;
  Password: string;
}
export enum Method {
  GET,
  POST,
  PUT,
  DELETE,
}

export interface Request {
  method: Method;
  url: string;
  headers: Array<{ name: string, value: any }>;
  body: any;
}

export class HTTP {
  private static request = (obj: Request) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(Method[obj.method], obj.url);
      if (obj.headers) {
        obj.headers.forEach(header => {
          xhr.setRequestHeader(header.name, header.value);
        });
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let a = xhr.response;
          try {
            a = JSON.parse(a);
          } catch (b) { }

          resolve(a);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(obj.body));
    });
  }

  public static Post = async (url: string, body: any): Promise<any> => {
    const d = await HTTP.request({
      body,
      headers: [],
      method: Method.POST,
      url,
    });
    return Promise.resolve(d);
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

export interface Error {
  Error: boolean;
  ErrorDetails: {
    General: string;
    More: string;
  };
}