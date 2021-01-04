import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // signInErrorMessage = '';
  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    if (this.authService.isSignedIn()){
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit(): void {
  }

  signUpClicked(): void {
    this.router.navigate(['/sign-up']);
  }
}
