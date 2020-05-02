import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  isSignedIn(): any {
    if (localStorage.getItem('currentUser')){
      return true;
    }
    else{
      return false;
    }
  }

  signInSuccess(event): void {
    for (const key in event) {
      if (key){
        for (const innerKey in event[key]) {
          if (innerKey === 'providerData') {
            const currentUser = event[key][innerKey][0];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log(JSON.parse(localStorage.getItem('currentUser')));
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

  signUpFailed(event): void {
    console.log(event);
  }
}
