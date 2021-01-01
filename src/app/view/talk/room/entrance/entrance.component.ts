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

  @Input() roomContents: Array<RoomContent>;

  params: any;
  paramSub: Subscription;
  talkRoomsObserver: any;
  talkRoomsSub: Subscription;

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
