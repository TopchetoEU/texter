import { Component, ViewChild } from '@angular/core';
import { GlobalsService } from './globals.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ConnectedPositioningStrategy, HorizontalAlignment, VerticalAlignment, NoOpScrollStrategy } from 'igniteui-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private gs: GlobalsService
  ) { }

  leftItems: Array<{ path: string, name: string }> = [
    { name: 'Home', path: '/' },
    { name: 'All users', path: '/allUsers' },
    { name: 'All articles', path: '/allArticles' },
  ];
  rightItems: Array<{ path: string, name: string }> = [
    { name: 'Log in', path: '/logIn' },
    { name: 'Sign in', path: '/signIn' },
  ];
  
  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Left,
      horizontalStartPoint: 1,
      verticalStartPoint: VerticalAlignment.Bottom
    }),
    scrollStrategy: new NoOpScrollStrategy()
  };

  menuCollapsed(): boolean {
    console.log(window.innerWidth < 950);
    return window.innerWidth < 950;
  }

}
