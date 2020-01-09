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

  ngAfterViewInit(): void {
  }
}
