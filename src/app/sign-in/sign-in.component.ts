import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  // signInErrorMessage = '';
  // tslint:disable-next-line:no-shadowed-variable
  constructor(private router: Router) {
    if (this.isSignedIn()){
      this.router.navigate(['/profile']);
    }
  }

  isSignedIn(): any {
    if (localStorage.getItem('currentUser')){
      return true;
    }
    else{
      return false;
    }
  }

  ngOnInit(): void {
  }

  signInSuccess(event): void {
    for (const key in event) {
      if (key){
        for (const innerKey in event[key]) {
          if (innerKey === 'providerData') {
            const currentUser = event[key][innerKey][0];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            // console.log(JSON.parse(localStorage.getItem('currentUser')));
          }
        }
      }
    }
    this.router.navigate(['/profile']);
  }

  signInFailed(event): void {
    console.log(event);
    // console.log(this.signInErrorMessage);
  }

  signUpClicked(): void {
    this.router.navigate(['/sign-up']);
  }

  resetPassworClicked(): void{
    this.router.navigate(['/reset-password']);
  }
}
