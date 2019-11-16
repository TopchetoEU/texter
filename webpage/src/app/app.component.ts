import { Component, ViewChild } from "@angular/core";
import { GlobalsService } from './globals.service';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private loaded = false;

  constructor(
    private gs: GlobalsService
  ) { }
  title = "texter";

  private visible = true;
  showProgressBar() {
    return !this.loaded;
  }
}
