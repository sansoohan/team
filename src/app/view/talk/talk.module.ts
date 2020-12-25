import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundModule } from 'src/app/modules/not-found/not-found.module';
import { PageLoadingModule } from 'src/app/modules/page-loading/page-loading.module';
import { TalkComponent } from './talk.component';

@NgModule({
  declarations: [
    TalkComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TalkComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TalkModule { }
