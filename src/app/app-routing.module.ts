import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from 'src/app/view/profile/profile.component';
import { NotFoundComponent } from 'src/app/modules/not-found/not-found.component';
import { SignInComponent } from 'src/app/view/sign-in/sign-in.component';
import { SignUpComponent } from 'src/app/view/sign-up/sign-up.component';
import { ContactComponent } from 'src/app/view/contact/contact.component';
import { MainComponent } from 'src/app/view/main/main.component';
import { TalkComponent } from './view/talk/talk.component';

const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:userName', component: ProfileComponent },
  { path: 'talk/:userName', component: TalkComponent }, // TalkComponent
  { path: 'talk/:userName/room/:roomId', component: TalkComponent }, // TalkComponent
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent }
];

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
