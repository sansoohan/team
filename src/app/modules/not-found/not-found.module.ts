import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  declarations: [
    NotFoundComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ NotFoundComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotFoundModule { }
