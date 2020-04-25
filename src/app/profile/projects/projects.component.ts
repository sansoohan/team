import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projectsContent: ProjectsContent = {
    id: 'someId',
    projects: [
      {
        organization: 'Vareal',
        projectName: 'Crawler Maintenace',
        memberNum: 2,
        position: 'PL/PG/SE',
        startedAt: new Date(2019, 4),
        finishedAt: null,
        taskDescriptions: [
          'Maintaining Crawler by chaning crawling algorithm.',
          'Making new crawler engine using proxy and other https libraries'
        ]
      },
      {
        organization: 'Vareal',
        projectName: 'Crawler Refactoring',
        memberNum: 2,
        position: 'PL/PG/SE',
        startedAt: new Date(2019, 4),
        finishedAt: new Date(2020, 1),
        taskDescriptions: [
          'Refactor Infrastructure using docker swarm',
          'Refactor Deploy Flow using docker registry',
          'Admin Page for developer'
        ]
      },
      {
        organization: 'Vareal',
        projectName: 'WebRTC Videochat',
        memberNum: 8,
        position: 'PG/SE',
        startedAt: new Date(2020, 2),
        finishedAt: null,
        taskDescriptions: [
          'Validating user data.',
          'Testing WebRTC SFU Engine.',
          'Fix Bugs for release.'
        ]
      }
    ]
  };
  constructor() { }

  ngOnInit() {
  }

}
