import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent {
  constructor(
    private db: DatabaseService,
    public r: Router
  ) { }

  done = true;

  signin(name, password, password2) {
    const err = (e) => {
      this.done = true;
      throw e;
    };
    const succ = () => {
      this.done = true;
      this.r.navigate(['/']);
      return;
    };

    if (password !== password2) {
      err('Password and password confirmation don\'t mach up');
    }

    this.done = false;

    this.db.Users.Get.ByName(name).catch((e) => {
      err(e);
    }).finally(() => {
      this.db.Users.Create({ Username: name, Password: password })
        .then(() => {
          succ();
        }).catch((e) => {
          err(e);
        });
    });
  }
}
