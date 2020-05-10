import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAddRemoveComponent } from './input-add-remove.component';

@NgModule({
  declarations: [
    InputAddRemoveComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ InputAddRemoveComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InputAddRemoveModule { }
