import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { User, DatabaseService } from '../database.service';
import { GlobalsService } from '../globals.service';

@Component({
    selector: 'app-all-users',
    templateUrl: './all-users.component.html',
    styleUrls: ['./all-users.component.scss'],
    providers: [NgForOf]
})
export class AllUsersComponent implements OnInit, AfterViewInit {
    users: User[] = [];
    done = false;

    constructor(
        private db: DatabaseService,
    ) {}

    async ngOnInit() {
        this.users = await this.db.Users.Get.All();
        this.done = true;
    }

    ngAfterViewInit() {
    }
}
