import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router
import { ProfileComponent } from './profile/profile.component';
import { BlogComponent } from './blog/blog.component';
import { NotFoundComponent } from './not-found/not-found.component';
// Import all the components for which navigation service has to be activated
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ContactComponent } from './contact/contact.component';
import { MainComponent } from './main/main.component';

const appRoutes: Routes = [
  // { path: '', redirectTo: '/profile', pathMatch: 'full' },
  { path: '', component: MainComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:userName', component: ProfileComponent },
  { path: 'blog/:userName', component: BlogComponent }, // PrologueComponent
  { path: 'blog/:userName/post/:postId', component: BlogComponent }, // PostComponent
  { path: 'blog/:userName/category/:categoryId', component: BlogComponent }, // CategoryComponent
  { path: 'blog/:userName/category/:categoryId/new-post', component: BlogComponent }, // PostComponent
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'contact', component: ContactComponent },
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
