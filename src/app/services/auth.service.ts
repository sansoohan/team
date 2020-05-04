import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private message: MessageService) { }

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
            // console.log(JSON.parse(localStorage.getItem('currentUser')));
            this.message.showSuccess(`Hello ${currentUser.displayName}`, null);
          }
        }
      }
    }
    this.router.navigate(['/profile']);
  }

  signInFailed(event): void {
    console.log(event);
    this.message.showError('Sign in failed', event.message);
  }

  signUpSuccess(): void {
    this.router.navigate(['/sign-in']);
    this.message.showSuccess('Sign up Success', null);
  }

  signUpFailed(event): void {
    console.log(event);
    this.message.showError('Sign up failed', event.message);
  }
}
