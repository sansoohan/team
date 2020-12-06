import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLoadingComponent } from './page-loading.component';

@NgModule({
  declarations: [
    PageLoadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ PageLoadingComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageLoadingModule { }
