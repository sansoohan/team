import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.css']
})
export class InterestsComponent implements OnInit {
  interestsContent: InterestsContent = {
    id: 'someId',
    descriptions: [
      'Hadoop Distribute System',
      'Hacking technique for developer',
      'Bio Sensor for Input Device',
      'AI Programing'
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
