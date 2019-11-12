import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService } from '../database.service';
import * as shajs from 'sha.js';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private globals: GlobalsService,
        private db: DatabaseService,
    ) { }

    ngOnInit() {
    }

    async login(n, p) {
        this.globals.userId = n;
        this.globals.password = p;
        this.globals.loggedIn = true;
        console.log(this.globals);

        const user = await this.db.Users.Get.ByName(n);
        console.log(shajs('sha256').update({p}).digest('hex'));
    }
}
