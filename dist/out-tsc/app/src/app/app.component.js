import { __awaiter, __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import { NotificationType } from './notifications.service';
let AppComponent = class AppComponent {
    constructor(gs, db, router, notifs) {
        this.gs = gs;
        this.db = db;
        this.router = router;
        this.notifs = notifs;
        this.foundUsers = [];
        this.foundArticles = [];
        this.resultsOnFocus = false;
        this.styleInterval = interval(50);
        this.leftItems = [
            { name: 'Home', path: '/', icon: 'home' },
        ];
        this.accountOptions = [
            { name: 'Log in', path: '/logIn' },
            { name: 'Sign in', path: '/signIn' },
        ];
    }
    redirect(url) {
        this.router.navigate([url]);
    }
    enterPressed(ev, userId, type) {
        if (ev.key === 'Enter') {
            this.acceptResult(userId, this.searchInput.nativeElement, type);
        }
    }
    acceptResult(userId, inputElement, type) {
        this.clearSearchElement(inputElement);
        this.redirect(type + '/' + userId.toString());
    }
    ngAfterViewInit() {
        const el = this.searchInput.nativeElement;
        this.styleInterval.subscribe(() => {
            this.updateSearchView(this.results.nativeElement, this.searchInput.nativeElement);
        });
    }
    updateSearchElements(el) {
        return __awaiter(this, void 0, void 0, function* () {
            if (el.value.split(' ').join('').length > 0) {
                this.db.searchAll(el.value)
                    .subscribe(searched => {
                    this.foundUsers = searched.Users;
                    this.foundArticles = searched.Articles;
                });
            }
            else {
                this.foundUsers = [];
                this.foundArticles = [];
            }
        });
    }
    clearSearchElement(el) {
        el.value = '';
        this.foundUsers = [];
        this.foundArticles = [];
    }
    getNotificationName(notType) {
        return NotificationType[notType];
    }
    updateSearchView(anchoredElement, anchorElement) {
        if (this.foundUsers.length > 0 || this.foundArticles.length > 0) {
            const rect = anchorElement.getBoundingClientRect();
            const x = rect.left - window.scrollX;
            const y = rect.bottom;
            const width = anchorElement.getBoundingClientRect().width;
            anchoredElement.style.top = y + 'px';
            anchoredElement.style.left = x + 'px';
            anchoredElement.style.width = width + 'px';
            anchoredElement.style.display = '';
        }
        else {
            anchoredElement.style.display = 'none';
        }
    }
    destroyNotificaton(notif, el) {
        notif.destroy();
    }
};
__decorate([
    ViewChild('search', { static: true })
], AppComponent.prototype, "searchInput", void 0);
__decorate([
    ViewChild('results', { static: true })
], AppComponent.prototype, "results", void 0);
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map