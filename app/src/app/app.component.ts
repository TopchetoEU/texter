import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { GlobalsService } from './globals.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import {
  HorizontalAlignment,
  VerticalAlignment,
  NoOpScrollStrategy,
  Point,
  ConnectedPositioningStrategy,
  IgxDropDownComponent
} from 'igniteui-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('phoneMenu', { static: true })
  private phoneMenu: ElementRef;

  @ViewChild('navButton', { static: true })
  private navButton: ElementRef;

  @ViewChild('dropdown', { static: true })
  private dropdown: IgxDropDownComponent;

  constructor(
    private gs: GlobalsService
  ) { }

  leftItems: Array<{ path: string, name: string, icon: string }> = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'All users', path: '/allUsers', icon: 'search' },
    { name: 'All articles', path: '/allArticles', icon: 'search' },
  ];
  accountOptions: Array<{ path: string, name: string }> = [
    { name: 'Log in', path: '/logIn' },
    { name: 'Sign in', path: '/signIn' },
  ];

  public overlaySettings = {
    positionStrategy: new ConnectedPositioningStrategy({
      horizontalDirection: HorizontalAlignment.Center,
      verticalDirection: VerticalAlignment.Bottom,
    }),
    scrollStrategy: new NoOpScrollStrategy()
  };

  menuCollapsed(): boolean {
    console.log(window.innerWidth < 950);
    return window.innerWidth < 950;
  }

  toggle() {
    this.dropdown.toggle(this.overlaySettings);
  }
  ngAfterViewInit(): void {
    const x = this.phoneMenu.nativeElement.getBoundingClientRect().width / 2;
    const y = this.navButton.nativeElement.getBoundingClientRect().bottom + 5;

    this.overlaySettings.positionStrategy.settings.target = new Point(x, y);
  }
}
