import { Component, OnInit, Input, Pipe, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';

import * as moment from 'moment';
import { PostContent } from './post.content';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from '../blog.content';
import Swal from 'sweetalert2';
import { CategoryContent } from '../category/category.content';
import { AuthService } from 'src/app/services/auth.service';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
// import 'moment/locale/de';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['../blog.component.css', './post.component.css']
})
export class PostComponent implements OnInit {
  @Output() goToPost: EventEmitter<string> = new EventEmitter();
  @Output() goToCategory: EventEmitter<string> = new EventEmitter();
  @Input() isEditingPost;

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

  postListObserver: Observable<PostContent[]>;
  postList: PostContent[];
  postListForm: any;
  isShowingPostList: boolean;

  blogId: string;
  isPage: boolean;
  updateOk: boolean;
  newDescription: '';

  paramSub: Subscription;
  params: any;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    public authService: AuthService,
    public routerHelper: RouterHelper,
    private formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isShowingPostContents = false;
      this.isEditingCategory = false;
      this.params = params;
    });
  }

  @Input()
  get blogContents(): Array<BlogContent> { return this._blogContents; }
  set blogContents(blogContents: Array<BlogContent>) {
    if (!blogContents || blogContents.length === 0){
      this.isPage = false;
      return;
    }
    this._blogContents = blogContents;
    this.blogId = blogContents[0].id;

    this.categoryContentsObserver = this.blogService.getCategoryContentsObserver({params: this.params}, this.blogId);
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
    const category = this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
      categoryContent.value.id === categoryId);
    return category.value.categoryTitle;
  }

  clickPostEdit() {
    this.isEditingPost = true;
  }

  clickPostEditCancel(){
    this.isEditingPost = false;
  }

  getPostMarkdownLines(){
    return this.postContentsForm?.controls?.postMarkdown?.value?.match(/\n/g).length + 2 || 3;
  }

  ngOnInit() {

  }

  OnDestroy() {
    this.paramSub?.unsubscribe();
    this.postContentsSub?.unsubscribe();
    this.categoryContentsSub?.unsubscribe();
  }
}
