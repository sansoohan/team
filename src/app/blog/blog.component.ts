import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { BlogContent } from './blog.content';
import { PostContent } from './post/post.content';
import { CategoryContent } from './category/category.content';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  isPage: boolean;
  isEditing: boolean;
  updateOk: boolean;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.isPage = true;
    this.isEditing = false;
    this.updateOk = true;
  }

  clickEdit() {
    this.isEditing = true;
  }

  clickEditCancel(){
    this.isEditing = false;
  }

  async clickEditUpdate(content: BlogContent | PostContent | CategoryContent){
    if (!this.updateOk){
      Swal.fire({
        icon: 'warning',
        title: 'Upate Fail',
        text: 'Checking User Email and Name',
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
          // this.profileService.updateProfile(profileContent, this.profileContentsObserver);
        }
        this.isEditing = false;
      }
      else if (result.dismiss === Swal.DismissReason.cancel){

      }
    });
  }

  ngOnInit(): void {
  }
}
