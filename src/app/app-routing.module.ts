import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';

// Import all the components for which navigation service has to be activated
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:userName', component: ProfileComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', component: NotFoundComponent }
];
// sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      anchorScrolling: 'enabled',
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
