import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogComponent } from './blog.component';
import { PostComponent } from './post/post.component';
import { CommentComponent } from './post/comment/comment.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BlogComponent,
    PostComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MarkdownModule.forChild(),
  ],
  exports: [
    BlogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class BlogModule { }
