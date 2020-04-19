import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  constructor(private router: Router) {
    if (this.isSignedIn()){
      this.router.navigate(['/profile']);
    }
  }

  ngOnInit(): void {
  }

  isSignedIn(): any {
    if (localStorage.getItem('currentUser')){
      return true;
    }
    else{
      return false;
    }
  }

  signUpSuccess(): void {
    this.router.navigate(['/sign-in']);
  }

  signUpFailed(): void {

  }

  onSignInClicked(): void {
    this.router.navigate(['/sign-in']);
  }
}
