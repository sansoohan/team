import { Component, OnInit, Input } from '@angular/core';
import { InterestsContent } from './interests.content';

@Component({
  selector: 'app-profile-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['../profile.component.css', '../profile.component.css']
})
export class InterestsComponent implements OnInit {
  @Input() interestsContent: InterestsContent;
  @Input() isEditing: boolean;
  @Input() profileForm: any;
  public newDescription: string;

  constructor() {
    this.newDescription = '';
  }

  ngOnInit() {
  }
}
