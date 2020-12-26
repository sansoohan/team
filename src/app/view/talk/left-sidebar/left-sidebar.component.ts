import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { DataTransferHelper } from 'src/app/helper/data-transefer.helper';
import { RouterHelper } from 'src/app/helper/router.helper';
import { FormHelper } from 'src/app/helper/form.helper';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Identicon from 'identicon.js';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TalkContent } from '../talk.content';
import { ProfileService } from 'src/app/services/profile.service';
import { ToastHelper } from 'src/app/helper/toast.helper';

@Component({
  selector: 'app-talk-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['../talk.component.css', './left-sidebar.component.css']
})
export class LeftSidebarComponent implements OnInit {
  @Output() clickCreateRoom: EventEmitter<null> = new EventEmitter();
  @Output() clickJoinRoom: EventEmitter<null> = new EventEmitter();
  @Output() clickLeaveRoom: EventEmitter<null> = new EventEmitter();
  @Input() isInRoom: boolean;

  paramSub: Subscription;
  params: any;
  isPage: boolean;
  isLoading: boolean;
  defaultSrc: string | SafeUrl;
  talkContent: TalkContent;

  constructor(
    public profileService: ProfileService,
    private toastHelper: ToastHelper,
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    public authService: AuthService,
    public dataTransferHelper: DataTransferHelper,
    public routerHelper: RouterHelper,
    public formHelper: FormHelper,
  ) {
    this.paramSub = this.route.params.subscribe(params => {
      this.isPage = true;
      this.isLoading = true;
      this.params = params;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });
  }

  @Input()
  get profileForm(): FormGroup { return this._profileForm; }
  set profileForm(profileForm: FormGroup) {
    this._profileForm = profileForm;
    this.talkContent = profileForm.value;
    if (profileForm.value.profileImageSrc !== ''){
      this.defaultSrc = profileForm.value.profileImageSrc;
    }
    else {
      const hash = profileForm.value.ownerId;
      const options = {
        // foreground: [0, 0, 0, 255],               // rgba black
        background: [230, 230, 230, 230],         // rgba white
        margin: 0.2,                              // 20% margin
        size: 420,                                // 420px square
        format: 'png'                             // use SVG instead of PNG
      };
      const data = new Identicon(hash, options).toString();
      this.defaultSrc = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data}`);
    }
  }
  // tslint:disable-next-line: variable-name
  _profileForm: FormGroup;

  handleClickCreateRoom() {
    this.clickCreateRoom.emit();
  }

  handleClickJoinRoom() {
    this.clickJoinRoom.emit();
  }

  handleClickLeaveRoom() {
    this.clickLeaveRoom.emit();
  }

  ngOnInit(): void {
  }

  OnDestroy() {
    this.paramSub.unsubscribe();
  }
}
