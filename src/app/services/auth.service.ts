import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private message: MessageService,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService
  ) { }

  /**
   * Initiate the password reset process for this user
   * @param email email of the user
   */
  resetPassword() {
    this.message.showPrompt('Reset Password', 'Please Enter your email').then(email => {
      this.afAuth.sendPasswordResetEmail(`${email}`, { url: `${window.location.origin}/sign-in` })
      .then(
        () => alert('A password reset link has been sent to your email address'),
        (rejectionReason) => this.message.showError('An error occurred while attempting to reset your password', rejectionReason))
      .catch(e => {
        this.message.showError('An error occurred while attempting to reset your password', e);
      });
    });
  }

  isSignedIn(): any {
    if (localStorage.getItem('currentUser')){
      return true;
    }
    else{
      return false;
    }
  }

  signInSuccess(event): void {
    const currentUser = {
      providerData: event.providerData,
      email: event.email,
      emailVerified: event.emailVerified,
      phoneNumber: event.phoneNumber,
      photoURL: event.photoURL,
      displayName: event.displayName,
      uid: event.uid
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    console.log(JSON.parse(localStorage.getItem('currentUser')));
    this.message.showSuccess(`Hello ${currentUser.displayName ? currentUser.displayName : currentUser.email}`, null);
    this.profileService.createNewProfile();
    this.router.navigate(['/profile']);
  }

  signInFailed(event): void {
    console.log(event);
    this.message.showError('Sign in failed', event.message);
  }

  signUpSuccess(): void {
    this.message.showSuccess('Sign up Success', null);
    this.router.navigate(['/sign-in']);
  }

  signUpFailed(event): void {
    console.log(event);
    if (event.code){
      this.message.showError('Sign up failed', event.message);
    }
    else{
      this.signUpSuccess();
    }
  }
}
