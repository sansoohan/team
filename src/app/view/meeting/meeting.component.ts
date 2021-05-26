import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeetingService } from 'src/app/services/meeting.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MeetingContent } from './meeting.content';
import { AuthService } from 'src/app/services/auth.service';
import { RouterHelper } from 'src/app/helper/router.helper';
import * as firebase from 'firebase/app';
import { CollectionSelect } from 'src/app/services/abstract/common.service';
import { environment } from 'src/environments/environment';
const FieldPath = firebase.default.firestore.FieldPath;

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})

export class MeetingComponent implements OnInit, OnDestroy {
  paramSub: Subscription;
  params: any;

  meetingContentsObserver?: Observable<MeetingContent[]>;
  meetingContentsSub?: Subscription;
  meetingContent?: MeetingContent;

  isPage = true;
  isLoading = true;

  constructor(
    public authService: AuthService,
    public routerHelper: RouterHelper,
    private meetingService: MeetingService,
    private route: ActivatedRoute,
  ) {
    this.paramSub = this.route.params.subscribe((params) => {
      this.params = params;
      this.meetingContentsObserver = this.meetingService.select<MeetingContent>(
        [
          environment.rootPath,
          `meetings`,
        ].join('/'),
        {
          where: [{
            fieldPath: new FieldPath('userName'),
            operator: '==',
            value: params?.userName,
          }]
        } as CollectionSelect
      );
      this.meetingContentsSub = this.meetingContentsObserver?.subscribe((meetingContents) => {
        if (meetingContents.length === 0) {
          this.isPage = false;
          const currentUser = this.authService.getCurrentUser();
          this.routerHelper.goToMeeting({userName: currentUser?.userName || 'sansoohan'});
          return;
        }

        this.meetingContent = meetingContents[0];
        this.isLoading = false;
      });
      if (!this.meetingContentsSub) {
        const currentUser = this.authService.getCurrentUser();
        this.routerHelper.goToMeeting({userName: currentUser?.userName || 'sansoohan'});
        return;
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
    this.meetingContentsSub?.unsubscribe();
  }
}
