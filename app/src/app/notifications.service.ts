import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notifications: Notification[] = [];

  private deleteDelegate = (notification: Notification) => {
    for (let i = 0; i < this.notifications.length; i++) {
      if (this.notifications[i] === notification) {
        this.notifications.splice(i, 1);
        break;
      }
    }

  }

  createNotification = (notification: Notification) => {
    notification.onDestroy.subscribe(this.deleteDelegate);
    this.notifications.push(notification);
    setTimeout(() => {
      this.deleteDelegate(notification);
    }, (notification.title.length + notification.content.length) * 30 + 2000);
  }
}

export enum NotificationType {
  Error,
  Success
}

export class Notification {
  title: string;
  content: string;
  type: NotificationType;

  animateFadeOut(el: HTMLElement) {
    el.animate([
      {
        opacity: parseFloat(el.style.opacity)
      },
      {
        opacity: 0
      }
    ], 100);
  }

  onDestroy: Subject<Notification> = new Subject<Notification>();

  public constructor(title: string, content: string, type: NotificationType) {
    this.title = title;
    this.content = content;
    this.type = type;
  }

  public destroy() {
    this.onDestroy.next(this);
    this.onDestroy.complete();
  }
}
