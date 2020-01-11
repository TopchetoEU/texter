import { Pipe, PipeTransform } from '@angular/core';
import { DatabaseService } from './database.service';

@Pipe({
  name: 'username'
})
export class UserPipe implements PipeTransform {
  constructor(
    private db: DatabaseService
  ) {

  }

  async transform(value: number, ...args: any[]): Promise<any> {
    return (await this.db.Users.Get.ById(value)).Username;
  }

}
