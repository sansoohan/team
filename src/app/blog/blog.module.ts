import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { BlogComponent } from './blog.component';

@NgModule({
  declarations: [
    BlogComponent,
  ],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
  ],
  exports: [
    BlogComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class BlogModule { }
