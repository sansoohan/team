import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { EducationComponent } from './education/education.component';
import { SkillsComponent } from './skills/skills.component';
import { InterestsComponent } from './interests/interests.component';
import { ProjectsComponent } from './projects/projects.component';
import { AdditionalProfilesComponent } from './additional-profiles/additional-profiles.component';
import { ProfileComponent } from './profile.component';
import { MonthpickerComponent } from '../modules/monthpicker/monthpicker.component';
import { MonthpickerModule } from '../modules/monthpicker/monthpicker.module';
import { InputAddRemoveModule } from '../modules/user-form/input-add-remove/input-add-remove.module';
import { NotFoundComponent } from '../not-found/not-found.component';

@NgModule({
  declarations: [
    ProfileComponent,
    AboutComponent,
    EducationComponent,
    SkillsComponent,
    InterestsComponent,
    ProjectsComponent,
    AdditionalProfilesComponent,
    NotFoundComponent,
    // EducationContent,
    // SkillsContent,
    // InterestsContent,
    // ProjectsContent,
    // AdditionalProfilesContent
  ],
  imports: [
    CommonModule,
    MonthpickerModule,
    InputAddRemoveModule
  ],
  exports: [
    ProfileComponent,
    MonthpickerModule,
    NotFoundComponent,
  ],
  providers: []
})
export class ProfileModule { }
