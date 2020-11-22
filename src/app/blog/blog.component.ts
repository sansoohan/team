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
    private fb: FormBuilder,
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
          this.categoryContentsForm = this.buildFormRecursively({categoryContents: this.categoryContents});

          if (params.categoryId){
            this.selectedCategory = this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
              categoryContent.value.id === this.selectedCategoryId);
            this.selectedChildCategories = this.getChildCategoriesRecusively(this.selectedCategory);
            const categoryIds = [this.selectedCategory, ...this.selectedChildCategories].map((categoryContent) =>
              categoryContent.value.id
            );

            this.postListObserver = this.blogService.getPostListObserver({params}, this.blogId, categoryIds);
            this.postListSub = this.postListObserver.subscribe(postList => {
              this.postList = postList;
              this.postListForm = this.buildFormRecursively({postList: this.postList});
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
              this.postContentsForm = this.buildFormRecursively(this.postContents[0]);
            });
            this.isShowingPostContents = true;
          }
        });
      });
    });
  }

  counter(i: number) {
    return new Array(i);
  }

  numberToDate(i: number){
    const date = new Date(i);
    return `${date.getFullYear()}. ${date.getMonth()}. ${date.getDate()}`;
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

  goToCategory(categoryId: string) {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || this.params?.userName;
    this.router.navigate(['/blog', queryUser, 'categories', categoryId]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  goToPost(postId: string) {
    this.router.onSameUrlNavigation = 'reload';
    const currentUser = JSON.parse(localStorage.currentUser || null);
    const queryUser = currentUser?.userName || currentUser?.uid || this.params?.userName;
    this.router.navigate(['/blog', queryUser, 'post', postId]).finally(() => {
      this.router.onSameUrlNavigation = 'ignore'; // Restore config after navigation completes
    });
  }

  getCategoryTitle(categoryId: string): string {
    const category = this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
      categoryContent.value.id === categoryId);
    return category.value.categoryTitle;
  }

  toggleCategoryCollapsed(category: FormGroup){
    const collapsed = !category.controls.collapsed.value;
    category.controls.collapsed.setValue(collapsed);
    let childCategories = [];
    if (!collapsed){
      childCategories = this.categoryContentsForm.controls.categoryContents.controls
      .filter((categoryForm) => categoryForm.value.parentCategoryId === category.value.id);
    } else {
      childCategories = this.getChildCategoriesRecusively(category);
    }
    childCategories.forEach((childCategory) => {
      childCategory.controls.hidden.setValue(collapsed);
      childCategory.controls.collapsed.setValue(!collapsed);
    });
  }

  getChildCategoriesRecusively(parentCategory: FormGroup): Array<FormGroup>{
    const childCategories = this.categoryContentsForm.controls.categoryContents.controls
    .filter((categoryForm) => categoryForm.value.parentCategoryId === parentCategory.value.id);
    if (childCategories.length === 0){
      return [];
    }

    let returnCategories = [...childCategories];
    for (const childCategory of childCategories){
      returnCategories = [
        ...returnCategories,
        ...this.getChildCategoriesRecusively(childCategory)
      ];
    }
    return returnCategories;
  }

  getPostMarkdownLines(){
    return this.postContentsForm?.controls?.postMarkdown?.value?.match(/\n/g).length + 2 || 3;
  }

  buildFormRecursively(profileContent: any): AbstractControl{
    if (profileContent instanceof Date) {
      return this.fb.control(new Date(profileContent).toISOString().slice(0, -1));
    }
    else if (profileContent instanceof Array){
      const retArray: FormArray = this.fb.array([]);
      for (const el of profileContent){
        retArray.push(this.buildFormRecursively(el));
      }
      return retArray;
    }
    else if (profileContent instanceof Object) {
      const retHash: FormGroup = this.fb.group({});
      for (const key in profileContent){
        if (key){
          retHash.addControl(key, this.buildFormRecursively(profileContent[key]));
        }
      }
      return retHash;
    }
    else {
      return this.fb.control(profileContent);
    }
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
