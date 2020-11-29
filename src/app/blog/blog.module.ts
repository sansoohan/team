import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogComponent } from './blog.component';
import { CommentComponent } from './post/comment/comment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostComponent } from './post/post.component';
import { CategoryComponent } from './category/category.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { PrologueComponent } from './prologue/prologue.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    BlogComponent,
    PostComponent,
    CategoryComponent,
    CommentComponent,
    LeftSidebarComponent,
    PrologueComponent,
    HeaderComponent,
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
