import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AboutContent, AboutSocial } from './about.content';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile-about',
  templateUrl: './about.component.html',
  styleUrls: ['../profile.component.css', './about.component.css']
})
export class AboutComponent implements OnInit {
  @Input() aboutContent: AboutContent;
  @Input() isEditing: boolean;
  @Input() profileForm: any;
  @Output() keyupUserName: EventEmitter<boolean> = new EventEmitter();

  hasUserNameCollision: boolean;

  public newAboutSocial: AboutSocial = new AboutSocial();

  constructor(
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
  }

  handleKeyupUserName(event) {
    this.hasUserNameCollision = false;
    this.keyupUserName.emit(this.hasUserNameCollision);
    if (event.target.value){
      const tmpSubscription = this.profileService.getUserNameCollisionObserver(event.target.value).subscribe(
        ([profileContent]) => {
          if (profileContent && profileContent?.ownerId !== this.profileForm.value.ownerId){
            this.hasUserNameCollision = true;
            this.keyupUserName.emit(this.hasUserNameCollision);
          }
          tmpSubscription.unsubscribe();
        }
      );
    }
  }
}
