import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, zip, Observable } from 'rxjs';
import { DataTransferHelper } from 'src/app/helper/data-transfer.helper';
import { RouterHelper } from 'src/app/helper/router.helper';
import { MeetingService } from 'src/app/services/meeting.service';
import { CollectionSelect } from 'src/app/services/abstract/common.service';
import * as firebase from 'firebase/app';
import { MeetingContent } from '../meeting.content';
import { RoomContent } from '../room/room.content';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
const FieldPath = firebase.default.firestore.FieldPath;

@Component({
  selector: 'app-meeting-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.scss']
})
export class EntranceComponent implements OnInit, OnDestroy {
  params: any;
  paramSub: Subscription;
  roomContentsObservers?: Array<Observable<RoomContent[]>>;
  roomContentsSub?: Subscription;
  roomContents?: Array<RoomContent>;
  blogId?: string;
  meetingId?: string;

  dataDebugFlag = false;
  isPage = true;
  pageIndex = 0;
  pageSize = 20;
  roomCreatedAtList: Array<number> = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private authService: AuthService,
    private routerHelper: RouterHelper,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
    });
  }

  @Input()
  get meetingContent(): MeetingContent|undefined { return this._meetingContent; }
  set meetingContent(meetingContent: MeetingContent|undefined) {
    if (!meetingContent){
      this.isPage = false;
      return;
    }
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
      this._meetingContent = meetingContent;
      this.meetingId = meetingContent.id;
      this.roomCreatedAtList = meetingContent?.roomCreatedAtList || [];
      // this.databaseRoot = `meetings/${meetingContent.id}/rooms/`;
      this.isPage = true;
      this.changePageList(null);
    });
  }
  // tslint:disable-next-line: variable-name
  private _meetingContent?: MeetingContent;

  async clickRemoveRoom(roomContent: RoomContent): Promise<void> {
    const roomCreatedAtList = Object.assign([], this.roomCreatedAtList).filter((createdAt) =>
      createdAt !== roomContent.createdAt);
    try {
      await Promise.all([
        this.meetingService.delete([
          environment.rootPath,
          `meetings/${this.meetingId}`,
          'rooms',
          roomContent.id,
        ].join('/'), {}),
        this.meetingService.update([
          environment.rootPath,
          `meetings/${this.meetingId}`,
        ].join('/'), {roomCreatedAtList}),
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  goToRoom(roomId: string): void {
    if (!roomId) {
      return;
    }
    this.router.navigate(['meeting', this.params.userName, 'room', roomId]);
  }

  async handleClickCreateRoom(): Promise<void> {
    const newRoom = new RoomContent();
    const {uid, userName} = this.authService.getCurrentUser();
    newRoom.userName = userName || '';
    newRoom.ownerId = uid || '';
    try {
      await Promise.all([
        this.meetingService.create([
          environment.rootPath,
          `meetings/${uid}`,
          'rooms',
        ].join('/'), newRoom),
        this.meetingService.update([
          environment.rootPath,
          `meetings/${uid}`,
        ].join('/'), {
          roomCreatedAtList: [...this.roomCreatedAtList, newRoom.createdAt]
        }),
      ]);
      const params = Object.assign({}, this.params);
      params.roomId = newRoom.id;
      this.routerHelper.goToMeeting(params);
    } catch (error) {
      console.error(error);
    }
  }

  changePageList(event: any): void {
    this.pageIndex = 0;
    this.pageSize = 20;
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }

    if (this.roomContentsSub) {
      this.roomContentsSub.unsubscribe();
    }

    const startIndex = this.pageIndex * this.pageSize;
    const selectedCreatedAtList = Object.assign([], this.roomCreatedAtList)
    .sort((createdA, createdB) => createdA - createdB)
    .splice(startIndex, startIndex + this.pageSize);

    this.roomContentsObservers = [];
    for (let index = 0; index < selectedCreatedAtList.length; index += 10) {
      const createdAtList = Object.assign([], selectedCreatedAtList).splice(index, index + 10);
      const commentContentsObserver = this.meetingService.select<RoomContent>(
        [
          environment.rootPath,
          `meetings/${this.meetingId}`,
          'rooms',
        ].join('/'),
        {
          where: [{
            fieldPath: new FieldPath('createdAt'),
            operator: 'in',
            value: createdAtList.length ? createdAtList : [-1],
          }]
        } as CollectionSelect
      );

      this.roomContentsObservers.push(commentContentsObserver);
    }

    this.roomContents = [];
    this.roomContentsSub = zip(...this.roomContentsObservers)?.subscribe((roomContentsList) => {
      this.roomContents = [];
      roomContentsList.forEach((roomContents) => {
        this.roomContents = [...this.roomContents || [], ...roomContents];
        this.roomContents.sort((commentA: any, commentB: any) => commentB.createdAt - commentA.createdAt);
      });
    });
  }

  countMember(roomContent: RoomContent): number {
    return roomContent.broadcastIds?.length || 0;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.roomContentsSub?.unsubscribe();
  }
}
