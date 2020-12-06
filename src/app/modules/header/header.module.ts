import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    NgxAuthFirebaseUIModule,
  ],
  exports: [ HeaderComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeaderModule { }
