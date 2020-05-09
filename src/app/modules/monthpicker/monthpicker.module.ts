import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthpickerComponent } from './monthpicker.component';

@NgModule({
  declarations: [
    MonthpickerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ MonthpickerComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MonthpickerModule { }
