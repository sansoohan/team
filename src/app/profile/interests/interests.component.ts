import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['../profile.component.css', '../profile.component.css']
})
export class InterestsComponent implements OnInit {
  @Input() interestsContent: InterestsContent;
  @Input() isEditing: boolean;

  constructor() { }

  ngOnInit() {
  }

}
