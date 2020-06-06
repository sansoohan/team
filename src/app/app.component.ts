import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AuthService } from './services/auth.service';
import {FormControl} from '@angular/forms';
import autocomplete from './modules/autocomplete/autocomplete';
import {startWith, map} from 'rxjs/operators';
import * as $ from 'jquery';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  searchValue: string;
  results: any;
  controll: FormControl;
  searchListNum: number;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    public authService: AuthService
  ) {
    this.searchValue = '';
    this.searchListNum = 0;
    this.controll = new FormControl();
  }

  onSignOut(): void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {

  }

  initSearch(event){
  }

  changeSearch(event){
    if (event.target.value){
      this.searchValue = event.target.value;
      console.log(this.searchValue);
      if (this.searchValue === ''){
        this.results = null;
      }
      else{
        this.results = this.firestore.collection('profiles', ref => ref
        .orderBy(new firebase.firestore.FieldPath('aboutContent', 'email'))
        .limit(10)
        .startAt(this.searchValue)
        .endAt(this.searchValue + '\uf8ff'))
        .valueChanges();
      }
    }
  }
}
