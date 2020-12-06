import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommentContent } from './comment.content';
import { BlogService } from 'src/app/services/blog.service';
import { FormGroup } from '@angular/forms';
import { FormHelper } from 'src/app/helper/form.helper';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { BlogContent } from '../../blog.content';
import { ProfileService } from 'src/app/services/profile.service';
import { ToastHelper } from 'src/app/helper/toast.helper';
import Swal from 'sweetalert2';
import { RouterHelper } from 'src/app/helper/router.helper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['../../blog.component.css', './comment.component.css']
})
export class CommentComponent implements OnInit {
  isPage: boolean;
  isEditingCommentIds: Array<string>;
  isShowingComment: boolean;
  hasNullCommentContentError: boolean;
  blogId: string;

  commentContents: CommentContent[];
  commentContentsSub: Subscription;
  commentContentsForm: any;
  commentContentsObserver: Observable<CommentContent[]>;

  paramSub: Subscription;
  params: any;

  constructor(
    public profileService: ProfileService,
    private toastHelper: ToastHelper,
    public routerHelper: RouterHelper,
    private route: ActivatedRoute,
    private blogService: BlogService,
    public formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
    private authService: AuthService,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isEditingCommentIds = [];
      this.hasNullCommentContentError = false;
      this.isShowingComment = false;
      this.params = params;
    });
  }

  @Input() isEditingPost: boolean;
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

    this.commentContentsObserver = this.blogService.getCommentContentsObserver(this.blogId, this.params.postId);
    this.commentContentsSub = this.commentContentsObserver.subscribe(commentContents => {
      if (!commentContents || commentContents.length === 0){
        this.isPage = false;
        return;
      }
      this.commentContents = commentContents;
      this.commentContents.sort((categoryA: CommentContent, categoryB: CommentContent) =>
        categoryA.commentNumber - categoryB.commentNumber);
      this.commentContentsForm =
        this.formHelper.buildFormRecursively({commentContents: this.commentContents});
      this.isShowingComment = true;
    });
  }
  // tslint:disable-next-line: variable-name
  private _blogContents: Array<BlogContent>;

  isOwner(commentOwnerId): boolean {
    if (!this.authService.isSignedIn()){
      return false;
    }

    return commentOwnerId === JSON.parse(localStorage.currentUser).uid;
  }

  getCommentMarkdownLines(commentContent){
    return commentContent?.controls?.postMarkdown?.value?.match(/\n/g)?.length + 2 || 3;
  }

  clickCommentEdit(commentId: string) {
    this.isEditingCommentIds.push(commentId);
  }

  clickCommentEditCancel(commentId) {
    this.isEditingCommentIds = this.isEditingCommentIds
    .filter((isEditingCommentId) => isEditingCommentId !== commentId);
  }

  handleClickEditCommentCreateUpdate(): void {
    const commentForm = this.formHelper.buildFormRecursively(new CommentContent());
    if (this.isEditingCommentIds.includes(commentForm.value.id)){
      this.hasNullCommentContentError = false;
      if (!commentForm.value.commentMarkdown){
        this.hasNullCommentContentError = true;
        return;
      }

      // tslint:disable-next-line: no-string-literal
      commentForm['controls'].postId.setValue(this.params.postId);
      this.blogService
      .create(
        `blogs/${this.blogContents[0].id}/comments`,
        commentForm
      )
      .then(() => {
        this.toastHelper.showSuccess('Comment Update', 'Success!');
      })
      .catch(e => {
        this.toastHelper.showWarning('Comment Update Failed.', e);
      });
    }
  }

  handleClickEditCommentUpdate(commentForm): void {
    if (this.isEditingCommentIds.includes(commentForm.value.id)){
      this.hasNullCommentContentError = false;
      if (!commentForm.value.commentMarkdown){
        this.hasNullCommentContentError = true;
        return;
      }

      this.blogService
      .update(
        `blogs/${this.blogContents[0].id}/comments/${commentForm.value.id}`,
        commentForm.value
      )
      .then(() => {
        this.toastHelper.showSuccess('Comment Update', 'Success!');
        this.isEditingCommentIds = this.isEditingCommentIds
        .filter((isEditingCommentId) => isEditingCommentId !== commentForm.value.id);
      })
      .catch(e => {
        this.toastHelper.showWarning('Comment Update Failed.', e);
      });
    }
  }

  handleClickEditCommentDelete(commentContent) {
    this.toastHelper.askYesNo('Remove Profile Category', 'Are you sure?').then((result) => {
      if (result.value && commentContent.value.id) {
        this.blogService.delete(
          `blogs/${this.blogContents[0].id}/comments/${commentContent.value.id}`,
        )
        .then(() => {
          this.toastHelper.showSuccess('Post Delete', 'OK');
          this.routerHelper.goToBlogCategory(this.params, commentContent.value.categoryId);
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
}
