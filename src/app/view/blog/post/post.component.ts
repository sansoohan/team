import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostContent } from './post.content';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from '../blog.content';
import { CategoryContent } from '../category/category.content';
import { AuthService } from 'src/app/services/auth.service';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { ProfileService } from 'src/app/services/profile.service';
import { ToastHelper } from 'src/app/helper/toast.helper';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-post',
  templateUrl: './post.component.html',
  styleUrls: ['../blog.component.css', './post.component.css']
})
export class PostComponent implements OnInit {
  @Output() goToPost: EventEmitter<string> = new EventEmitter();
  @Output() goToCategory: EventEmitter<string> = new EventEmitter();
  @Input() isEditingPost;
  @Input() isCreatingPost;

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
  hasNullPostTitleError: boolean;

  postListObserver: Observable<PostContent[]>;
  postList: PostContent[];
  postListForm: any;

  blogId: string;
  isPage: boolean;
  updateOk: boolean;
  newDescription: '';

  paramSub: Subscription;
  params: any;

  constructor(
    public profileService: ProfileService,
    private toastHelper: ToastHelper,
    private route: ActivatedRoute,
    private blogService: BlogService,
    public authService: AuthService,
    public routerHelper: RouterHelper,
    private formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.postContents = [new PostContent()];
      this.postContentsForm = this.formHelper.buildFormRecursively(this.postContents[0]);
      this.hasNullPostTitleError = false;
      this.isShowingPostContents = false;
      this.isEditingCategory = false;
      this.params = params;
    });
  }

  @Input()
  get blogContents(): Array<BlogContent> { return this._blogContents; }
  set blogContents(blogContents: Array<BlogContent>) {
    this.isPage = true;
    if (!blogContents || blogContents.length === 0){
      this.isPage = false;
      return;
    }
    this._blogContents = blogContents;
    this.blogId = blogContents[0].id;

    this.categoryContentsObserver = this.blogService.getCategoryContentsObserver(this.blogId);
    this.categoryContentsSub = this.categoryContentsObserver.subscribe(categoryContents => {
      if (!categoryContents || categoryContents.length === 0){
        this.isPage = false;
        return;
      }

      this.categoryContents = categoryContents;
      this.categoryContents.sort((categoryA: CategoryContent, categoryB: CategoryContent) =>
        categoryA.categoryNumber - categoryB.categoryNumber);
      this.categoryContentsForm =
        this.formHelper.buildFormRecursively({categoryContents: this.categoryContents});

      if (this.params.postId){
        this.postContentsObserver = this.blogService.getPostContentsObserver({params: this.params}, this.blogId);
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
  }
  // tslint:disable-next-line: variable-name
  private _blogContents: Array<BlogContent>;

  getCategoryTitle(categoryId: string): string {
    const category = this.categoryContentsForm?.controls.categoryContents.controls.find((categoryContent) =>
      categoryContent.value.id === categoryId);
    return category?.value.categoryTitle;
  }

  clickPostEdit() {
    this.isEditingPost = true;
  }

  clickPostEditCancel(){
    this.isEditingPost = false;
  }

  getPostMarkdownLines(){
    return this.postContentsForm?.controls?.postMarkdown?.value?.match(/\n/g)?.length + 2 || 3;
  }

  handleClickEditPostCreateUpdate() {
    if (this.isEditingPost){
      this.hasNullPostTitleError = false;
      if (!this.postContentsForm.value.postTitle){
        this.hasNullPostTitleError = true;
        return;
      }

      this.postContentsForm.controls.categoryId.setValue(this.params.categoryId);
      this.postContentsForm.controls.ownerId.setValue(JSON.parse(localStorage.currentUser).uid);
      this.blogService
      .create(
        `blogs/${this.blogContents[0].id}/posts`,
        this.postContentsForm
      )
      .then(() => {
        this.toastHelper.showSuccess('Post Update', 'Success!');
        this.routerHelper.goToBlogPost(this.params, this.postContentsForm.value.id);
      })
      .catch(e => {
        this.toastHelper.showWarning('Post Update Failed.', e);
      });
    }
  }

  handleClickEditPostCreateCancel() {
    this.routerHelper.goToBlogCategory(this.params, this.params.categoryId);
  }

  async handleClickEditPostUpdate() {
    if (this.isEditingPost){
      this.blogService
      .update(
        `blogs/${this.blogContents[0].id}/posts/${this.postContentsForm.value.id}`,
        this.postContentsForm.value
      )
      .then(() => {
        this.toastHelper.showSuccess('Post Update', 'Success!');
      })
      .catch(e => {
        this.toastHelper.showWarning('Post Update Failed.', e);
      });
    }
    this.isEditingPost = false;
  }

  async handleClickEditPostDelete() {
    this.toastHelper.askYesNo('Remove Profile Category', 'Are you sure?').then((result) => {
      if (result.value) {
        this.blogService.delete(
          `blogs/${this.blogContents[0].id}/posts/${this.postContentsForm.value.id}`,
        )
        .then(() => {
          this.toastHelper.showSuccess('Post Delete', 'OK');
          this.routerHelper.goToBlogCategory(this.params, this.postContentsForm.value.categoryId);
        })
        .catch(e => {
          this.toastHelper.showWarning('Post Delete Failed.', e);
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  ngOnInit() {

  }

  OnDestroy() {
    this.paramSub?.unsubscribe();
    this.postContentsSub?.unsubscribe();
    this.categoryContentsSub?.unsubscribe();
  }
}
