import { Component, OnInit, OnDestroy  } from '@angular/core';
import * as firebase from 'firebase/app';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import Identicon from 'identicon.js';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { ProfileContent } from './profile.content';
import Swal from 'sweetalert2';
import { TypeScriptEmitter } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileContentsObserver: Observable<ProfileContent[]>;
  profileContents: ProfileContent[];
  defaultSrc: any;
  isEditing: boolean;
  isPage: boolean;
  userName: string;
  paramSub: any;
  profileSub: any;

  constructor(
    public profileService: ProfileService,
    public authService: AuthService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isEditing = false;
      this.isPage = true;
      this.userName = params.userName;
      this.profileContentsObserver = this.profileService.getProfileContentsObserver(this.userName);
      this.profileSub = this.profileContentsObserver.subscribe(profileContents => {
        this.profileContents = this.replaceToDateRecursively(profileContents);
        if (this.profileContents.length === 0){
          this.isPage = false;
        }
        if (this.profileContents[0].profileImageSrc){
          this.defaultSrc = this.profileContents[0].profileImageSrc;
        }
        else {
          const hash = this.profileContents[0].ownerId;
          const options = {
            // foreground: [0, 0, 0, 255],               // rgba black
            background: [230, 230, 230, 230],         // rgba white
            margin: 0.2,                              // 20% margin
            size: 420,                                // 420px square
            format: 'png'                             // use SVG instead of PNG
          };
          const data = new Identicon(hash, options).toString();
          this.defaultSrc = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data}`);
        }
      });
    });
  }

  clickEdit() {
    this.isEditing = true;
  }

  async clickEditUpdate(profileContent: ProfileContent){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      // tslint:disable-next-line:quotemark
      text: "Remove this data",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        if (this.isEditing){
          this.profileService.updateProfile(profileContent, this.profileContentsObserver);
        }
        this.isEditing = false;
      }
      else if (result.dismiss === Swal.DismissReason.cancel){

      }
    });
    // console.log(profileContent);
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

  scrollToContactTypes(userName: string, titleName: string) {
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/profile', userName], { fragment: titleName }).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }
  ngOnInit(): void {
  }

  OnDestroy() {
    this.paramSub.unsubscribe();
    this.profileSub.unsubscribe();
  }
}
