import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  email?: string;
  password?: string;

  // MVVM - Mode-View-ViewModel
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });



  // Angular Services
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  navigateToUsersPage() {
    this.userService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).subscribe(userData => {
      console.log(userData);
      this.router.navigateByUrl('/users');
    });
  }

}
