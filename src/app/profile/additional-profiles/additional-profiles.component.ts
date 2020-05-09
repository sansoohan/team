import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-additional-profiles',
  templateUrl: './additional-profiles.component.html',
  styleUrls: ['../profile.component.css', './additional-profiles.component.css']
})
export class AdditionalProfilesComponent implements OnInit {
  @Input() additaionProfilesContent: Array<AdditaionProfileContent>;
  @Input() isEditing: boolean;

  constructor() { }

  ngOnInit() {
  }

}
