import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundModule } from 'src/app/modules/not-found/not-found.module';
import { PageLoadingModule } from 'src/app/modules/page-loading/page-loading.module';
import { MeetingComponent } from './meeting.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { RoomComponent } from './room/room.component';
import { EntranceComponent } from './room/entrance/entrance.component';

@NgModule({
  declarations: [
    MeetingComponent,
    LeftSidebarComponent,
    RoomComponent,
    EntranceComponent,
  ],
  imports: [
    CommonModule,
    PageLoadingModule,
  ],
  exports: [
    MeetingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MeetingModule { }
