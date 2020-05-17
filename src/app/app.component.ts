import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  // tslint:disable-next-line:no-shadowed-variable
  constructor(firestore: AngularFirestore, private router: Router) {

  }

  isSignedIn(): any {
    if (localStorage.getItem('currentUser')){
      return true;
    }
    else{
      return false;
    }
  }

  clickSignOut(): void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }
}
