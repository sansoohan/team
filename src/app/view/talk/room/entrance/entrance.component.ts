import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { TalkContent } from '../../talk.content';
import { TransitionCheckState } from '@angular/material/checkbox';
import { RoomContent } from '../room.content';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';

@Component({
  selector: 'app-talk-room-entrance',
  templateUrl: './entrance.component.html',
  styleUrls: ['./entrance.component.css']
})
export class EntranceComponent implements OnInit, OnDestroy {
  @Output() clickBackToCreatedRoom: EventEmitter<string> = new EventEmitter();
  @Output() clickBackToJoinedRoom: EventEmitter<string> = new EventEmitter();

  params: any;
  paramSub: Subscription;
  talkRoomsObserver: any;
  talkRoomsSub: Subscription;
  roomContents: Array<RoomContent>;

  @Input()
  get talkContents(): Array<TalkContent> { return this._talkContents; }
  set talkContents(talkContents: Array<TalkContent>) {
    this._talkContents = talkContents;
    this.talkRoomsObserver = this.firestore
    .collection<TalkContent>('talks').doc(this.talkContents[0].id)
    .collection<RoomContent>('rooms').valueChanges();

    this.talkRoomsSub = this.talkRoomsObserver.subscribe((roomContents) => {
      this.roomContents = roomContents;
    });
  }
  // tslint:disable-next-line: variable-name
  _talkContents: Array<TalkContent>;

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    public dataTransferHelper: DataTransferHelper,
  ) {
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
    });
  }

  handleClickBackToCreatedRoom(roomId: string): void {
    this.clickBackToCreatedRoom.emit(roomId);
  }

  handleClickBackToJoinedRoom(roomId: string): void {
    this.clickBackToJoinedRoom.emit(`${window.location.href}/room/${roomId}`);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }
}
