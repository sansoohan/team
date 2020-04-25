import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
// import {AdditaionProfileContent} from './additional-profiles/additional-profile.content';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  additaionProfilesContent: Array<AdditaionProfileContent> = [
    {
      id: 'someId',
      title: 'workflow',
      largeGroups: [
        {
          largeGroupName: null,
          smallGroups: [
            {
              smallGroupName: 'Core Engine',
              descriptions: [
                {descriptionDetail: 'Run exameple code', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Modify interface on exameple code', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Integrate Test on Local', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'System Test on Remote Dev Server', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make Test Server', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make API and Document', faIcon: 'fa-li fa fa-check'}
              ]
            },
            {
              smallGroupName: 'New Feature',
              descriptions: [
                {descriptionDetail: 'Make API and Document', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Get Requirements', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Draw UI Design', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Ask Requirement Details', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make UI Design', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Design/Migrate Database', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Make API with validation', faIcon: 'fa-li fa fa-check'},
                {descriptionDetail: 'Fix bug on new feature', faIcon: 'fa-li fa fa-check'},
              ]
            }
          ]
        }
      ]
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }

}
