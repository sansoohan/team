import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import Identicon from 'identicon.js';
import { DomSanitizer } from '@angular/platform-browser';


// import * as imagePicker from 'nativescript-imagepicker';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileContentsObserver: Observable<ProfileContent[]>;
  hash: string;
  options: any;
  data: string;
  defaultSrc: any;

  constructor(public profileService: ProfileService, private domSanitizer: DomSanitizer) {
    this.profileContentsObserver = this.profileService.getProfileContentsObserver();
    if (localStorage.currentUser){
      this.hash = JSON.parse(localStorage.currentUser).uid;
      this.options = {
        // foreground: [0, 0, 0, 255],               // rgba black
        background: [230, 230, 230, 230],         // rgba white
        margin: 0.2,                              // 20% margin
        size: 420,                                // 420px square
        format: 'png'                             // use SVG instead of PNG
      };
      this.data = new Identicon(this.hash, this.options).toString();
      this.defaultSrc = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.data}`);
      this.profileContentsObserver.subscribe(profileContents => {
        if (profileContents[0].profileImageSrc){
          this.defaultSrc = profileContents[0].profileImageSrc;
        }
      });
    }
  }

  ngOnInit(): void {

  }
}
