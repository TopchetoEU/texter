import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let NotificationsService = class NotificationsService {
    constructor() {
        this.notifications = [];
        this.deleteDelegate = (notification) => {
            for (let i = 0; i < this.notifications.length; i++) {
                if (this.notifications[i] === notification) {
                    this.notifications.splice(i, 1);
                    break;
                }
            }
        };
        this.createNotification = (notification) => {
            notification.onDestroy.subscribe(this.deleteDelegate);
            this.notifications.push(notification);
            setTimeout(() => {
                this.deleteDelegate(notification);
            }, (notification.title.length + notification.content.length) * 30 + 2000);
        };
    }
};
NotificationsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationsService);
export { NotificationsService };
export var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["Error"] = 0] = "Error";
    NotificationType[NotificationType["Success"] = 1] = "Success";
})(NotificationType || (NotificationType = {}));
export class Notification {
    constructor(title, content, type) {
        this.onDestroy = new Subject();
        this.title = title;
        this.content = content;
        this.type = type;
    }
    animateFadeOut(el) {
        el.animate([
            {
                opacity: parseFloat(el.style.opacity)
            },
            {
                opacity: 0
            }
        ], 100);
    }
    destroy() {
        this.onDestroy.next(this);
        this.onDestroy.complete();
    }
}
//# sourceMappingURL=notifications.service.js.map