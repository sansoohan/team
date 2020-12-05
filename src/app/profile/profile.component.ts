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
import { ToastHelper } from '../helper/toast.helper';

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
    private toastHelper: ToastHelper,
    public authService: AuthService,
    private route: ActivatedRoute,
    private formHelper: FormHelper,
    public routerHelper: RouterHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isLoading = true;
      this.isEditing = false;
      this.isPage = true;
      this.hasUserNameCollision = false;
      this.hasUserEmailCollision = false;
      this.params = params;
      this.profileContentsObserver = this.profileService.getProfileContentsObserver({params});
      this.profileSub = this.profileContentsObserver.subscribe(profileContents => {
        this.profileContents = profileContents;
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
        this.isLoading = false;
      });
    });
  }

  handleAddAdditionalProfile(){
    this.profileForm?.controls.additaionProfilesContent.push(
      this.formHelper.buildFormRecursively(this.newAdditaionProfileContent)
    );
  }

  handleRemoveAdditionalProfile(index){
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

  handleClickEditProfileStart() {
    this.isEditing = true;
  }

  handleClickEditProfileAbort() {
    this.isEditing = false;
  }

  handleKeyupUserName(hasCollision: boolean) {
    this.hasUserNameCollision = hasCollision;
  }

  async handleClickEditProfileUpdate() {
    this.toastHelper.askYesNo('Update Profile', 'Are you sure?').then((result) => {
      if (this.hasUserNameCollision) {
        this.toastHelper.showError('Upate Fail', 'User Name is already registered.');
        return;
      }

      if (result.value) {
        if (this.isEditing){
          this.profileService
          .updateProfile(this.profileForm.value)
          .then(() => {
            this.toastHelper.showSuccess('Profile Update', 'Success!');
          })
          .catch(e => {
            console.error(e);
            this.toastHelper.showWarning('Profile Update Failed.', e);
          });
        }
        this.isEditing = false;
      }
      else if (result.dismiss === Swal.DismissReason.cancel){

      }
    });
  }

  ngOnInit(): void {
  }

  OnDestroy() {
    this.paramSub.unsubscribe();
    this.profileSub.unsubscribe();
  }
}
