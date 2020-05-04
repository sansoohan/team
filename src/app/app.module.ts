import {APP_BASE_HREF} from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import * as firebase from 'firebase/app';
// currently there is a bug while building the app with --prod
// - https://github.com/RaphaelJenni/FirebaseUI-Angular/issues/76
// the plugin exposes the two libraries as well. You can use those:
// import {FirebaseUIModule, firebase, firebaseui} from 'firebaseui-angular';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileModule } from './profile/profile.module';
import { AppRoutingModule } from './app-routing.module';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SweetAlert2Module.forRoot(),
    NgxAuthFirebaseUIModule.forRoot(
      environment.firebase,
      () => 'Developers',
      {
        enableFirestoreSync: true, // enable/disable autosync users with firestore
        toastMessageOnAuthSuccess: false, // whether to open/show a snackbar message on auth success - default : true
        toastMessageOnAuthError: false, // whether to open/show a snackbar message on auth error - default : true
        authGuardFallbackURL: '/loggedout', // url for unauthenticated users - to use in combination with canActivate feature on a route
        authGuardLoggedInURL: '/loggedin', // url for authenticated users - to use in combination with canActivate feature on a route
        passwordMaxLength: 30, // `min/max` input parameters in components should be within this range.
        passwordMinLength: 8, // Password length min/max in forms independently of each componenet min/max.
        // Same as password but for the name
        nameMaxLength: 50,
        nameMinLength: 2,
        // If set, sign-in/up form is not available until email has been verified.
        // Plus protected routes are still protected even though user is connected.
        guardProtectedRoutesUntilEmailIsVerified: true,
        enableEmailVerification: true, // default: true
      }
    ),
    ProfileModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    FormsModule,
    MatPasswordStrengthModule,
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
