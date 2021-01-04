import { Component, OnInit, Input } from '@angular/core';
import { EducationsContent, EducationContent } from './educations.content';

@Component({
  selector: 'app-profile-education',
  templateUrl: './education.component.html',
  styleUrls: ['../profile.component.css', './education.component.css']
})
export class EducationComponent implements OnInit {
  @Input() educationsContent: EducationsContent;
  @Input() isEditing: boolean;
  @Input() profileForm: any;
  public newEducation: EducationContent = new EducationContent();
  public newDescription: '';

  selectedYearAsText: string;
  selectedMonthIndex: number;
  selectedMonthAsText: string;

  constructor() {

  }

  ngOnInit() {

  }
}
