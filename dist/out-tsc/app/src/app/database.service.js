import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
const url = 'http://texterme.eu:4000/';
let DatabaseService = class DatabaseService {
    constructor(http) {
        this.http = http;
    }
    getAllArticles() {
        return new Observable(ob => {
            this.http.post(url + 'articles/get', { Selector: {} }).subscribe(val => {
                if (val.Error.Error === true) {
                    ob.error(val.Error);
                }
                ob.next(val.Found);
            });
        });
    }
    getArticleBySelector(selector, options) {
        return new Observable(ob => {
            this.http.post(url + 'articles/get', Object.assign({ Selector: selector }, options))
                .subscribe(val => {
                if (val.Found.length === 1) {
                    ob.next(val.Found[0]);
                }
                else if (val.Found.length < 1) {
                    ob.error(new Error('No article is found', 'Are you misspelling the title'));
                }
                else if (val.Found.length > 1) {
                    ob.error(new Error('DB Error', 'The DB\'s feeling a bit meshed up today.'));
                }
                ob.complete();
            });
        });
    }
    getArticlesBySelector(selector, options, one) {
        return new Observable(ob => {
            this.http.post(url + 'articles/get', Object.assign({ Selector: selector }, options)).subscribe(val => {
                if (val.Error.Error === true) {
                    ob.error(val.Error);
                }
                else {
                    ob.next(val.Found);
                }
            });
        });
    }
    changeArticles(selector, options, credentials) {
        const body = {
            Selector: selector,
            Credentials: credentials,
            Like: options.Like,
            DoModify: (options.Modify && options.Modify.length > 0) || options.Like,
            Modify: {}
        };
        const modify = {};
        if (options.Modify) {
            options.Modify.forEach(el => {
                modify[el.Propname] = el.Value;
            });
        }
        body.Modify = modify;
        return this.http.post(url + 'articles/change', body);
    }
    createArticle(newArticle, credentials) {
        return new Observable(ob => {
            this.http.post(url + 'articles/create', {
                Credentials: credentials,
                New: newArticle
            }).subscribe(val => {
                if (val.Error.Error) {
                    ob.error(val.Error);
                }
                else {
                    ob.next(val.NewID);
                }
            });
        });
    }
    getAllUsers() {
        return this.http.post(url + 'users/get', { Selector: {} });
    }
    getUserBySelector(selector, options) {
        return new Observable(ob => {
            this.http.post(url + 'users/get', Object.assign({ Selector: selector }, options))
                .subscribe(val => {
                if (val.Found.length === 1) {
                    ob.next(val.Found[0]);
                }
                else if (val.Found.length < 1) {
                    ob.error(new Error('No user is found', 'Are you misspelling the username'));
                }
                else if (val.Found.length > 1) {
                    ob.error(new Error('DB Error', 'The DB\'s feeling a bit meshed up today.'));
                }
                ob.complete();
            });
        });
    }
    getUsersBySelector(selector, options) {
        return new Observable(ob => {
            this.http.post(url + 'users/get', Object.assign({ Selector: selector }, options)).subscribe(val => {
                if (val.Error.Error === true) {
                    ob.error(val.Error);
                }
                else {
                    ob.next(val.Found);
                }
            });
        });
    }
    changeUsers(selector, options, credentials) {
        const body = {
            Selector: selector,
            Credentials: credentials,
            Follow: options.Follow,
            DoModify: options.Follow || options.Modify.length > 0,
            Modify: {}
        };
        const modify = {};
        if (options.Modify) {
            options.Modify.forEach(el => {
                modify[el.Propname] = el.Value;
            });
        }
        body.Modify = modify;
        return new Observable(ob => {
            this.http.post(url + 'users/change', body).subscribe(val => {
                if (val.Error.Error) {
                    ob.error(val.Error);
                }
            });
        });
    }
    createUser(newUser) {
        return new Observable(ob => {
            this.http.post(url + 'users/create', {
                New: newUser
            }).subscribe(val => {
                if (val.Error.Error) {
                    ob.error(val.Error);
                }
                else {
                    ob.next(val.NewID);
                }
            });
        });
    }
    checkCredentials(credentials) {
        return this.http.post(url + 'others/checkCreds', { Credentials: credentials });
    }
    searchAll(value) {
        const regex = '(' + value.split(/[, ]/g).join(')(') + ')';
        console.log(regex);
        return new Observable(ob => {
            this.getUsersBySelector({
                Username: { $regex: regex }
            }, {
                DoPaging: true,
                Paging: {
                    PageSize: 20,
                    PageCount: 0,
                }
            }).subscribe(users => {
                this.getArticlesBySelector({
                    Title: { $regex: regex }
                }, {
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
};
DatabaseService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], DatabaseService);
export { DatabaseService };
export var Like;
(function (Like) {
    Like[Like["Neutralise"] = 0] = "Neutralise";
    Like[Like["Dislike"] = 1] = "Dislike";
    Like[Like["Like"] = 2] = "Like";
})(Like || (Like = {}));
export class User {
}
export class Article {
}
export class Error {
    constructor(general, more) {
        if (general && more) {
            this.Error = true;
            this.ErrorDetails = new ErrorDetails(general, more);
        }
        else {
            this.Error = false;
        }
    }
}
Error.NoError = new Error();
export class ErrorDetails {
    constructor(general, more) {
        this.General = general;
        this.More = more;
    }
}
//# sourceMappingURL=database.service.js.map