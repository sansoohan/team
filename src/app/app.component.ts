import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import * as firebase from 'firebase/app';
import FieldPath = firebase.firestore.FieldPath;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  searchValue: string;
  results: any;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    public authService: AuthService
  ) {
    this.searchValue = '';
  }

  onSignOut(): void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {

  }

  changeSearch(event){
    if (event.target.value){
      this.searchValue = event.target.value;
      if (this.searchValue === ''){
        this.results = null;
      }
      else{
        this.results = this.firestore.collection('profiles', ref => ref
        .orderBy(new FieldPath('aboutContent', 'email'))
        .limit(10)
        .startAt(this.searchValue)
        .endAt(this.searchValue + '\uf8ff'))
        .valueChanges();
      }
    }
  }
}
