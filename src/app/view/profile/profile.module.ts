import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutComponent } from './about/about.component';
import { EducationComponent } from './education/education.component';
import { SkillsComponent } from './skills/skills.component';
import { InterestsComponent } from './interests/interests.component';
import { ProjectsComponent } from './projects/projects.component';
import { AdditionalProfilesComponent } from './additional-profiles/additional-profiles.component';
import { ProfileComponent } from './profile.component';
import { MonthpickerModule } from 'src/app/modules/monthpicker/monthpicker.module';
import { InputAddRemoveModule } from 'src/app/modules/user-form/input-add-remove/input-add-remove.module';
import { NotFoundModule } from 'src/app/modules/not-found/not-found.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { PageLoadingModule } from 'src/app/modules/page-loading/page-loading.module';

@NgModule({
  declarations: [
    ProfileComponent,
    AboutComponent,
    EducationComponent,
    SkillsComponent,
    InterestsComponent,
    ProjectsComponent,
    AdditionalProfilesComponent,
    LeftSidebarComponent,
  ],
  imports: [
    CommonModule,
    MonthpickerModule,
    ReactiveFormsModule,
    InputAddRemoveModule,
    NotFoundModule,
    PageLoadingModule,
  ],
  exports: [
    ProfileComponent,
    MonthpickerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class ProfileModule { }
