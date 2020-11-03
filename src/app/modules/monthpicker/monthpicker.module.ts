import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthpickerComponent } from './monthpicker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MonthpickerComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  exports: [ MonthpickerComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MonthpickerModule { }
