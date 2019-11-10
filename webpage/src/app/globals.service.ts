import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  private innerLoading = false;

  public onLoadingChange: EventEmitter<boolean> = new EventEmitter();

  public get loading(): boolean {
    return this.innerLoading;
  }
  public set loading(v: boolean) {
    this.innerLoading = v;
    this.onLoadingChange.emit(v);
  }
}
