import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../globals.service';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(
        private globals: GlobalsService,
        private db: DatabaseService,
        public r: Router
    ) { }

    ngOnInit() {
    }

    async login(n, p) {
        try {
            const a =     await this.db.Users.Get.ByName(n);
            const error = await this.db.checkCredentials({ Password: p, UserId: a.ID });

            if (error.success) {
                this.globals.userId = n;
                this.globals.password = p;
                this.globals.loggedIn = true;
                console.info("Successfull login");
            } else {
                throw error.error;
            }
        } catch (err) {
            console.error(err);
        }

    }
}
