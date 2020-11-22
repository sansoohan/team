import { Component, OnInit, Input, Pipe } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';

import * as moment from 'moment';
import { PostContent } from './post/post.content';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from './blog.content';
import Swal from 'sweetalert2';
import { CategoryContent } from './category/category.content';
import { AuthService } from 'src/app/services/auth.service';
import { FormHelper } from '../helper/form.helper';
import { DataTransferHelper } from '../helper/data-transefer.helper';
import { RouterHelper } from '../helper/router.helper';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  blogContentsObserver: Observable<BlogContent[]>;
  blogContents: BlogContent[];
  blogContensSub: Subscription;

  categoryContentsObserver: Observable<CategoryContent[]>;
  categoryContents: CategoryContent[];
  categoryContentsSub: Subscription;
  categoryContentsForm: any;
  isEditingCategory: boolean;

  postContentsObserver: Observable<PostContent[]>;
  postContents: PostContent[];
  postContentsSub: Subscription;
  postContentsForm: any;
  isShowingPostContents: boolean;
  isEditingPost: boolean;

  postListObserver: Observable<PostContent[]>;
  postList: PostContent[];
  postListSub: Subscription;
  postListForm: any;
  isShowingPostList: boolean;

  blogId: string;
  isPage: boolean;
  updateOk: boolean;
  newDescription: '';

  newPostConent = new PostContent();
  paramSub: Subscription;
  params: any;
  selectedCategory: FormGroup;
  selectedChildCategories: Array<FormGroup>;
  selectedCategoryId: string;
  selectedChildCategoryIds: Array<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
    public routerHelper: RouterHelper,
    private blogService: BlogService,
    public authService: AuthService,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isShowingPostList = false;
      this.isShowingPostContents = false;
      this.isEditingCategory = false;
      this.isEditingPost = false;
      this.params = params;
      this.selectedCategoryId = params.categoryId;

      this.blogContentsObserver = this.blogService.getBlogContentsObserver({params});
      this.blogContensSub = this.blogContentsObserver.subscribe(blogContents => {
        this.blogContents = blogContents;
        this.blogId = this.blogContents[0].id;
        if (this.blogContents.length === 0 || !this.blogContents){
          this.isPage = false;
          return;
        }

        this.categoryContentsObserver = this.blogService.getCategoryContentsObserver({params}, this.blogId);
        this.categoryContentsSub = this.categoryContentsObserver.subscribe(categoryContents => {
          this.categoryContents = categoryContents;
          this.categoryContents.sort((categoryA: CategoryContent, categoryB: CategoryContent) =>
            categoryA.categoryNumber - categoryB.categoryNumber);
          if (this.categoryContents.length === 0 || !this.categoryContents){
            this.isPage = false;
            return;
          }
          this.categoryContentsForm = this.formHelper.buildFormRecursively({categoryContents: this.categoryContents});

          if (params.categoryId){
            this.selectedCategory = this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
              categoryContent.value.id === this.selectedCategoryId);
            this.selectedChildCategories =
              this.formHelper.getChildCategoriesRecusively(
                this.categoryContentsForm.controls.categoryContents.controls, this.selectedCategory
              );
            const categoryIds = [this.selectedCategory, ...this.selectedChildCategories].map((categoryContent) =>
              categoryContent.value.id
            );

            this.postListObserver = this.blogService.getPostListObserver({params}, this.blogId, categoryIds);
            this.postListSub = this.postListObserver.subscribe(postList => {
              this.postList = postList;
              this.postListForm = this.formHelper.buildFormRecursively({postList: this.postList});
            });
            this.isShowingPostList = true;
          }

          if (params.postId){
            this.postContentsObserver = this.blogService.getPostContentsObserver({params}, this.blogId);
            this.postContentsSub = this.postContentsObserver.subscribe(postContents => {
              this.postContents = postContents;
              if (this.postContents.length === 0 || !this.postContents){
                this.isPage = false;
                return;
              }
              this.postContents[0].postMarkdown = this.postContents[0].postMarkdown.replace(/\\n/g, '\n');
              this.postContentsForm = this.formHelper.buildFormRecursively(this.postContents[0]);
            });
            this.isShowingPostContents = true;
          }
        });
      });
    });
  }

  countChildCategory(categoryId: string) {
    const count = this.categoryContents.filter((categoryContent) =>
      categoryContent.parentCategoryId === categoryId && categoryContent.id !== categoryId
    ).length;
    return count;
  }

  countChildPost() {
    let count = 0;
    this.selectedChildCategories.forEach((categoryContent) => {
      count += categoryContent.value.postCount;
    });
    return count;
  }

  getCategoryTitle(categoryId: string): string {
    const category = this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
      categoryContent.value.id === categoryId);
    return category.value.categoryTitle;
  }

  getPostMarkdownLines(){
    return this.postContentsForm?.controls?.postMarkdown?.value?.match(/\n/g).length + 2 || 3;
  }

  clickCategoryEdit() {
    this.isEditingCategory = true;
  }

  clickCategoryEditCancel(){
    this.isEditingCategory = false;
  }

  async clickCategoryEditUpdate(content: BlogContent | PostContent | CategoryContent){
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
        if (this.isEditingCategory){
          // this.profileService.updateProfile(profileContent, this.profileContentsObserver);
        }
        this.isEditingCategory = false;
      }
      else if (result.dismiss === Swal.DismissReason.cancel){

      }
    });
  }


  clickPostEdit() {
    this.isEditingPost = true;
  }

  clickPostEditCancel(){
    this.isEditingPost = false;
  }

  async clickPostEditUpdate(content: BlogContent | PostContent | CategoryContent){
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
        if (this.isEditingPost){
          // this.profileService.updateProfile(profileContent, this.profileContentsObserver);
        }
        this.isEditingPost = false;
      }
      else if (result.dismiss === Swal.DismissReason.cancel){

      }
    });
  }


  ngOnInit() {

  }

  OnDestroy() {
    this.paramSub?.unsubscribe();
    this.blogContensSub?.unsubscribe();
    this.postListSub?.unsubscribe();
    this.postListSub?.unsubscribe();
  }
}
