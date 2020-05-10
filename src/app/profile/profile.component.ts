import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import Identicon from 'identicon.js';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { ProfileContent } from './profile.content';

// import * as imagePicker from 'nativescript-imagepicker';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileContentsObserver: Observable<ProfileContent[]>;
  profileContents: ProfileContent[];
  hash: string;
  options: any;
  data: string;
  defaultSrc: any;
  isEditing: boolean;

  constructor(
    public profileService: ProfileService,
    public authService: AuthService,
    private domSanitizer: DomSanitizer
  ) {
    this.isEditing = false;
    if (!this.profileContentsObserver){
      this.profileContentsObserver = this.profileService.getProfileContentsObserver();
    }
    this.profileContentsObserver.subscribe(profileContents => {
      this.profileContents = this.replaceToDateRecursively(profileContents);
    });
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

  clickEdit() {
    this.isEditing = true;
  }

  async clickEditUpdate(profileContent: ProfileContent){
    // this.replaceToDateRecursively(profileContent);
    console.log(profileContent);
    if (this.isEditing){
      await this.profileService.updateProfile(profileContent, this.profileContentsObserver);
    }
    this.isEditing = false;
  }

  clickEditCancel(){
    this.isEditing = false;
  }

  replaceToDateRecursively(profileContent: any){
    if (profileContent instanceof Array){
      for (let i = 0; i < profileContent.length; i++){
        if (profileContent[i] instanceof firebase.firestore.Timestamp){
          profileContent[i] = profileContent[i].toDate();
          // console.log(profileContent[i]);
        }
        else{
          this.replaceToDateRecursively(profileContent[i]);
        }
      }
    }
    else if (profileContent instanceof Object) {
      for (const key in profileContent){
        if (key){
          if (profileContent[key] instanceof firebase.firestore.Timestamp){
            profileContent[key] = profileContent[key].toDate();
            // console.log(profileContent[key]);
          }
          else{
            this.replaceToDateRecursively(profileContent[key]);
          }
        }
      }
    }
    return profileContent;
  }

  ngOnInit(): void {

  }
}
