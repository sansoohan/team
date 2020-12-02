import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { RouterHelper } from 'src/app/helper/router.helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchValue: string;
  results: any;

  isPage: boolean;
  params: any;
  paramSub: Subscription;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    private firestore: AngularFirestore,
    private route: ActivatedRoute,
    public authService: AuthService,
    public routerHelper: RouterHelper,
  ) {
    this.searchValue = '';
    this.paramSub = this.route.params.subscribe(params => {
      this.isPage = true;
      this.params = params;
    });
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
        .orderBy(new firebase.firestore.FieldPath('aboutContent', 'email'))
        .limit(10)
        .startAt(this.searchValue)
        .endAt(this.searchValue + '\uf8ff'))
        .valueChanges();
      }
    }
  }
}
