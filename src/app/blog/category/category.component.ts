import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PostContent } from '../post/post.content';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';
import { BlogContent } from '../blog.content';
import { CategoryContent } from '../category/category.content';
import { AuthService } from 'src/app/services/auth.service';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';

@Component({
  selector: 'app-blog-category',
  templateUrl: './category.component.html',
  styleUrls: ['../blog.component.css', './category.component.css']
})
export class CategoryComponent implements OnInit {
  categoryContentsObserver: Observable<CategoryContent[]>;
  categoryContents: CategoryContent[];
  categoryContentsSub: Subscription;
  categoryContentsForm: any;
  isEditingCategory: boolean;

  postContentsObserver: Observable<PostContent[]>;
  postContents: PostContent[];
  postContentsForm: any;
  isShowingCategoryContents: boolean;
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
    private blogService: BlogService,
    public authService: AuthService,
    public routerHelper: RouterHelper,
    private formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isShowingCategoryContents = false;
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
      this.categoryContentsForm = this.formHelper.buildFormRecursively({categoryContents: this.categoryContents});

      if (this.params.categoryId){
        this.selectedCategory =
          this.categoryContentsForm.controls.categoryContents.controls.find((categoryContent) =>
          categoryContent.value.id === this.params.categoryId);
        this.selectedChildCategories =
          this.formHelper.getChildContentsRecusively(
            this.categoryContentsForm.controls.categoryContents.controls, this.selectedCategory
          );
        const categoryIds = [this.selectedCategory, ...this.selectedChildCategories].map((categoryContent) =>
          categoryContent.value.id
        );

        this.postListObserver = this.blogService.getPostListObserver({params: this.params}, this.blogId, categoryIds);
        this.postListSub = this.postListObserver.subscribe(postList => {
          this.postList = postList;
          this.postListForm = this.formHelper.buildFormRecursively({postList: this.postList});
        });
        this.isShowingPostList = true;
      }
    });
  }
  // tslint:disable-next-line: variable-name
  private _blogContents: Array<BlogContent>;

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

  ngOnInit() {

  }

  OnDestroy() {
    this.paramSub?.unsubscribe();
    this.postListSub?.unsubscribe();
    this.categoryContentsSub?.unsubscribe();
  }
}
