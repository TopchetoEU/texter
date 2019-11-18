import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService } from '../database.service';

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
        const error = await this.db.checkCredentials({ Password: p, UserId: n });

        this.globals.userId = n;
        this.globals.password = p;
        this.globals.loggedIn = true;
    }
}
