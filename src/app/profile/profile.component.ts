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
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AdditaionProfileContent } from './additional-profiles/additional-profile.content';
import { FormHelper } from '../helper/form.helper';
import { DataTransferHelper } from '../helper/data-transefer.helper';
import { RouterHelper } from '../helper/router.helper';

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
  isLoading: boolean;
  hasUserNameCollision: boolean;
  hasUserEmailCollision: boolean;
  updateOk: boolean;
  userEmail: string;
  validateUserName: string;
  validateUserEmail: string;
  paramSub: any;
  profileSub: any;
  params: any;
  profileForm: any;
  public newAdditaionProfileContent: AdditaionProfileContent = new AdditaionProfileContent();

  constructor(
    public profileService: ProfileService,
    public authService: AuthService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage,
    private formHelper: FormHelper,
    private dataTranseferHelper: DataTransferHelper,
    public routerHelper: RouterHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isLoading = true;
      this.isEditing = false;
      this.isPage = true;
      this.hasUserNameCollision = false;
      this.hasUserEmailCollision = false;
      this.updateOk = true;
      this.params = params;
      this.profileContentsObserver = this.profileService.getProfileContentsObserver({params});
      this.profileSub = this.profileContentsObserver.subscribe(profileContents => {
        this.profileContents = this.dataTranseferHelper.replaceToDateRecursively(profileContents);
        if (this.profileContents.length === 0 || !this.profileContents){
          this.isPage = false;
          return;
        }

        const userName = this.profileContents[0].aboutContent.userName;
        const currentUser = JSON.parse(localStorage.currentUser || null);
        if (currentUser){
          currentUser.userName = userName;
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        this.routerHelper.scrollToProfile(this.params, 'about');

        this.profileForm = this.formHelper.buildFormRecursively(this.profileContents[0]);

        if (this.profileContents[0].profileImageSrc !== ''){
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

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    });
  }

  async uploadProfileImageSrc(profileContent) {
    await Swal.fire({
      title: 'Select Your Profile Image',
      input: 'file',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Update Image',
      cancelButtonText: 'Remove Image',
      cancelButtonColor: '#d33',
      inputAttributes: {
        // tslint:disable-next-line:object-literal-key-quotes
        'accept': 'image/*',
        'aria-label': 'Upload your profile picture'
      }
    }).then(data => {
      const filePath = `profile/${JSON.parse(localStorage.currentUser).uid}/about/profileImage`;
      const fileRef = this.storage.ref(filePath);

      if (data.value) {
        const file = data.value;
        const task = this.storage.upload(filePath, file);

        task
        .then(() => {
          fileRef.getDownloadURL().subscribe(imageUrl => {
            profileContent.profileImageSrc = imageUrl;
            this.profileService.updateProfile(profileContent, this.profileContentsObserver);
            Swal.fire({
              icon: 'success',
              title: 'Your Profile Image is uploaded!',
              showConfirmButton: false,
              timer: 1500
            });
          });
        })
        .catch(e => console.error(e));
      }
      else if (data.dismiss === Swal.DismissReason.cancel) {
        fileRef.delete();
        profileContent.profileImageSrc = null;
        this.profileService.updateProfile(profileContent, this.profileContentsObserver);
        Swal.fire({
          icon: 'success',
          title: 'Your Profile Image is uploaded!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  addAdditionalProfile(){
    this.profileForm?.controls.additaionProfilesContent.push(
      this.formHelper.buildFormRecursively(this.newAdditaionProfileContent)
    );
  }

  removeAdditionalProfile(index){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
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
        this.profileForm?.controls.additaionProfilesContent.removeAt(index);
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  clickEdit() {
    this.isEditing = true;
  }

  async clickEditUpdate(profileContent: ProfileContent){
    if (!this.updateOk){
      Swal.fire({
        icon: 'warning',
        title: 'Upate Fail',
        text: 'Checking User Email and Name',
        showCancelButton: false
      });
      return;
    }

    if (this.hasUserEmailCollision){
      Swal.fire({
        icon: 'warning',
        title: 'Upate Fail',
        text: 'User Email is already registered.',
        showCancelButton: false
      });
      return;
    }
    else if (this.hasUserNameCollision){
      Swal.fire({
        icon: 'warning',
        title: 'Upate Fail',
        text: 'User Name is already registered.',
        showCancelButton: false
      });
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    await swalWithBootstrapButtons.fire({
      title: 'Updating...',
      // tslint:disable-next-line:quotemark
      text: "Are you sure?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
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
  }

  clickEditCancel(){
    this.isEditing = false;
  }

  ngOnInit(): void {
  }

  OnDestroy() {
    this.paramSub.unsubscribe();
    this.profileSub.unsubscribe();
  }
}
