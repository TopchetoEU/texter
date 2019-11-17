import { Injectable, } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  userId: string;
  password: string;
  loggedIn = false;
}
