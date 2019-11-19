import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  public userId: number;
  public password: string;
  public loggedIn = false;

  constructor() { }
}
