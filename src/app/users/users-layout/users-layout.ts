import { Component } from '@angular/core';
import { UserList } from '../user-list/user-list';

@Component({
  selector: 'app-users-layout',
  standalone: true,
  imports: [UserList],
  template: `<app-user-list />`
})
export class UsersLayout {}
