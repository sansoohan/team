import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastHelper } from '../helper/toast.helper';
import { AngularFireAuth } from '@angular/fire/auth';
import { ProfileService } from './profile.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private toast: ToastHelper,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService
  ) { }

  /**
   * Initiate the password reset process for this user
   * @param email email of the user
   */
  resetPassword() {
    this.toast.showPrompt('Reset Password', 'Please Enter your email').then(email => {
      this.afAuth.sendPasswordResetEmail(`${email}`, { url: `${window.location.origin}/sign-in` })
      .then(
        () => alert('A password reset link has been sent to your email address'),
        (rejectionReason) => this.toast.showError('An error occurred while attempting to reset your password', rejectionReason))
      .catch(e => {
        this.toast.showError('An error occurred while attempting to reset your password', e);
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
    this.toast.showSuccess(`Hello ${currentUser.displayName ? currentUser.displayName : currentUser.email}`, null);
    this.profileService.createNewProfile();
    this.router.navigate(['/profile']);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  signInFailed(event): void {
    this.toast.showError('Sign In failed', event.toast);
  }

  signUpSuccess(): void {
    this.toast.showSuccess('Sign Up Success', null);
    this.router.navigate(['/sign-in']);
  }

  signUpFailed(event): void {
    if (event.code){
      this.toast.showError('Sign up failed', event.toast);
    }
    else{
      this.signUpSuccess();
    }
  }

  onSignOut(): void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }
}
