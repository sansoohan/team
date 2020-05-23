import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbededGooglemapComponent } from './embeded-googlemap.component';

@NgModule({
  declarations: [
    EmbededGooglemapComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ EmbededGooglemapComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmbededGooglemapModule { }
