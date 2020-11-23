import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostContent } from '../post.content';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CommentContent } from './comment.content';
import { BlogService } from 'src/app/services/blog.service';
import { FormGroup } from '@angular/forms';
import { FormHelper } from 'src/app/helper/form.helper';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { BlogContent } from '../../blog.content';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['../../blog.component.css', './comment.component.css']
})
export class CommentComponent implements OnInit {
  isPage: boolean;
  isShowingComment: boolean;
  blogId: string;

  commentContents: CommentContent[];
  commentContentsSub: Subscription;
  commentContentsForm: any;
  commentContentsObserver: Observable<CommentContent[]>;

  paramSub: Subscription;
  params: any;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    public formHelper: FormHelper,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
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

  ngOnInit() {
  }
}
