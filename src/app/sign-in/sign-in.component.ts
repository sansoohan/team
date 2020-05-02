import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // signInErrorMessage = '';
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isSignedIn()){
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit(): void {
  }

  signUpClicked(): void {
    this.router.navigate(['/sign-up']);
  }

  resetPassworClicked(): void{
    this.router.navigate(['/reset-password']);
  }
}
