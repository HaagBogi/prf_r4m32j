import { Component, OnInit } from '@angular/core';
import * as users_data from '../data/users.json';
import { User } from '../model/User';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  // structural directives: *ngIf, *ngSwitch, *ngFor
  // attribute directives

  users?: User[];
  chosenUser?: User;

  displayedColumns: string[] = ['username', 'name', 'address'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.users = users_data.users;
    this.dataSource = new MatTableDataSource<User>(this.users);
  }

  openDetails(user: User) {
    this.chosenUser = user;
  }

  receiveUser(event: any) {
    console.log(event);
  }

  logout() {
    this.userService.logout().subscribe(() => {
       this.router.navigateByUrl('/welcome');
    });
  }

}
