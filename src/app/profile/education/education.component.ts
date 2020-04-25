import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit {
  educationsContent: Array<EducationContent> = [
    {
      id: 'someId',
      index: 0,
      organization: 'University of Dankook',
      degree: 'Bachelor of Computer Science',
      descriptions: ['Software Enginneering', 'GPA: 3.02'],
      startedAt: new Date(2010, 3),
      finishedAt: new Date(2019, 10)
    },
    {
      id: 'someId',
      index: 1,
      organization: 'BulGok High School',
      degree: 'Math/Science',
      descriptions: [],
      startedAt: new Date(2006, 3),
      finishedAt: new Date(2009, 1)
    }
  ];

  constructor() {

  }

  ngOnInit() {
  }

}
