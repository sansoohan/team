import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { RouterHelper } from 'src/app/helper/router.helper';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../profile.component.css']
})
export class HeaderComponent {
  searchValue: string;
  results: any;
  paramSub: Subscription;
  params: any;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    public routerHelper: RouterHelper,
    public authService: AuthService,
  ) {
    this.searchValue = '';
    this.paramSub = this.route.params.subscribe(params => {
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

  onSignOut(): void{
    localStorage.removeItem('currentUser');
    this.router.navigate(['/sign-in']);
  }

  OnDestroy() {
    this.paramSub.unsubscribe();
  }
}
