import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EducationsContent } from './educations.content';

import * as moment from 'moment';
// import 'moment/locale/de';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['../profile.component.css', './education.component.css']
})
export class EducationComponent implements OnInit {
  @Input() educationsContent: EducationsContent;
  @Input() isEditing: boolean;


  selectedYearAsText: string;
  selectedMonthIndex: number;
  selectedMonthAsText: string;

  constructor() {

  }

  ngOnInit() {

  }

  onChange(event) {
    console.log(event);
    // console.warn(this.selectedYearAsText, this.selectedMonthAsText, `(month index: ${this.selectedMonthIndex})`)
  }
}
