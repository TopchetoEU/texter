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

    done = true;

    ngOnInit() {
    }

    async login(name, password) {
        const err = (e) => {
            this.done = true;
            throw e;
        };
        const succ = () => {
            this.done = true;
            return;
        };
        this.done = false;
        try {
            const user =  await this.db.Users.Get.ByName(name);
            const error = await this.db.checkCredentials({ Password: password, UserId: user.ID });

            if (error.success) {
                this.globals.userId = user.ID;
                this.globals.password = password;
                this.globals.loggedIn = true;
                succ();
            } else {
                err(error);
            }
        } catch (e) {
            err(e);
        }

    }
}
